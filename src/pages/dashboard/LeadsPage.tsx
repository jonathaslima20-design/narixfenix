import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Tag as TagIcon, Phone } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  closestCenter,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useLeadCategories, type LeadCategoryRow } from '../../lib/useLeadCategories';
import { resolveIcon } from '../../lib/iconMap';
import { leadDisplayName, leadPhoneLabel } from '../../lib/leadDisplay';
import { Lead } from '../../lib/types';
import { ImportMethodPicker } from '../../components/leads/ImportMethodPicker';
import { BulkImportLeadsModal } from '../../components/leads/BulkImportLeadsModal';
import { ImportFromWhatsAppModal } from '../../components/leads/ImportFromWhatsAppModal';
import { LeadDetailsDrawer } from '../../components/chat/LeadDetailsDrawer';

type LeadPatch = Partial<Lead> & { id: string };

function DraggableCard({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
    data: { lead },
  });
  const style = isDragging ? { opacity: 0.3 } : undefined;
  return (
    <div ref={setNodeRef} style={style} className="tilt-card">
      <button
        type="button"
        onClick={onOpen}
        {...listeners}
        {...attributes}
        className="glass w-full text-left rounded-2xl p-3.5 hover:border-white/[0.14] transition-colors cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-[14px] font-medium text-white leading-tight truncate">
            {leadDisplayName(lead)}
          </h4>
          {lead.unread_count && lead.unread_count > 0 ? (
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white text-black">
              {lead.unread_count}
            </span>
          ) : null}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/45">
          <Phone size={10} strokeWidth={1.5} />
          <span className="truncate">{leadPhoneLabel(lead)}</span>
        </div>
        {lead.last_message && (
          <p className="mt-2 text-[12px] text-white/55 line-clamp-2 leading-snug">{lead.last_message}</p>
        )}
        {lead.tags && lead.tags.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {lead.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-white/65"
              >
                <TagIcon size={8} strokeWidth={1.5} />
                {t}
              </span>
            ))}
          </div>
        )}
      </button>
    </div>
  );
}

function Column({
  category,
  leads,
  onOpen,
}: {
  category: LeadCategoryRow;
  leads: Lead[];
  onOpen: (l: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: category.key });
  const Icon = resolveIcon(category.icon);
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] w-[280px] sm:w-[300px] rounded-3xl border transition-colors ${
        isOver ? 'border-white/20 bg-white/[0.03]' : 'border-white/[0.06] bg-white/[0.015]'
      }`}
    >
      <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} strokeWidth={1.5} className="text-white/70" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
            {category.label}
          </span>
        </div>
        <span className="font-mono text-[10px] text-white/35">{leads.length}</span>
      </div>
      <div className="flex-1 p-3 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)]">
        {leads.length === 0 ? (
          <div className="text-center py-8 text-[11px] text-white/30">
            Arraste leads para cá
          </div>
        ) : (
          leads.map((l) => <DraggableCard key={l.id} lead={l} onOpen={() => onOpen(l)} />)
        )}
      </div>
    </div>
  );
}

export function LeadsPage() {
  usePageTitle('Gestão de Leads — BrainLead');
  const { user } = useAuth();
  const { categories } = useLeadCategories();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [importPickerOpen, setImportPickerOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const refresh = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', user.id)
      .order('last_activity_at', { ascending: false, nullsFirst: false });
    setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`crm-leads-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as Lead, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) => prev.map((l) => (l.id === (payload.new as Lead).id ? (payload.new as Lead) : l)));
          } else if (payload.eventType === 'DELETE') {
            setLeads((prev) => prev.filter((l) => l.id !== (payload.old as { id: string }).id));
          }
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((l) =>
      `${l.name ?? ''} ${l.phone ?? ''} ${(l.tags ?? []).join(' ')}`.toLowerCase().includes(q),
    );
  }, [leads, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, Lead[]>();
    for (const cat of categories) map.set(cat.key, []);
    for (const lead of filtered) {
      const key = lead.category && map.has(lead.category) ? lead.category : categories[0]?.key ?? 'cold';
      const arr = map.get(key);
      if (arr) arr.push(lead);
    }
    return map;
  }, [filtered, categories]);

  async function moveLead(leadId: string, newCategory: string) {
    const prev = leads.find((l) => l.id === leadId);
    if (!prev || prev.category === newCategory) return;
    setLeads((list) => list.map((l) => (l.id === leadId ? { ...l, category: newCategory } : l)));
    const { error } = await supabase
      .from('leads')
      .update({ category: newCategory, updated_at: new Date().toISOString() })
      .eq('id', leadId);
    if (error) {
      setLeads((list) => list.map((l) => (l.id === leadId ? { ...l, category: prev.category } : l)));
    }
  }

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const over = e.over;
    if (!over) return;
    const leadId = String(e.active.id);
    const targetCategory = String(over.id);
    moveLead(leadId, targetCategory);
  }

  const activeLead = activeId ? leads.find((l) => l.id === activeId) ?? null : null;

  const handleLeadUpdated = useCallback((patch: LeadPatch) => {
    setLeads((prev) => prev.map((l) => (l.id === patch.id ? { ...l, ...patch } : l)));
    setSelectedLead((curr) => (curr && curr.id === patch.id ? { ...curr, ...patch } : curr));
  }, []);

  const handleLeadDeleted = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedLead(null);
  }, []);

  if (!user) return null;

  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1400px] mx-auto"
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ pipeline</span>
            <h1
              className="mt-1.5 font-display font-medium tracking-tightest text-white"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1 }}
            >
              Gestão de Leads
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Arraste leads entre colunas para atualizar a temperatura.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar lead..."
                className="pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 w-full sm:w-60"
              />
            </div>
            <button
              onClick={() => setImportPickerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <Plus size={14} />
              Importar
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-white/40 text-sm">Carregando...</div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto pb-4">
              {categories.map((cat) => (
                <Column
                  key={cat.key}
                  category={cat}
                  leads={grouped.get(cat.key) ?? []}
                  onOpen={setSelectedLead}
                />
              ))}
            </div>
            <DragOverlay>
              {activeLead ? (
                <div className="glass w-[270px] rounded-2xl p-3.5 opacity-95">
                  <h4 className="text-[14px] font-medium text-white truncate">
                    {leadDisplayName(activeLead)}
                  </h4>
                  <div className="mt-1 text-[11px] text-white/45 truncate">{leadPhoneLabel(activeLead)}</div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </motion.div>

      <ImportMethodPicker
        open={importPickerOpen}
        onClose={() => setImportPickerOpen(false)}
        onPickFile={() => setBulkOpen(true)}
        onPickWhatsApp={() => setWhatsappOpen(true)}
      />
      <BulkImportLeadsModal open={bulkOpen} onClose={() => setBulkOpen(false)} onComplete={refresh} />
      <ImportFromWhatsAppModal open={whatsappOpen} onClose={() => setWhatsappOpen(false)} onComplete={refresh} />

      <LeadDetailsDrawer
        open={selectedLead !== null}
        onClose={() => setSelectedLead(null)}
        lead={selectedLead}
        userId={user.id}
        onLeadUpdated={handleLeadUpdated}
        onLeadDeleted={handleLeadDeleted}
      />
    </div>
  );
}
