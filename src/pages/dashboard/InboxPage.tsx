import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useInstances } from '../../lib/useInstances';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Lead, SendMode } from '../../lib/types';
import { ConversationList } from '../../components/chat/ConversationList';
import { ChatPanel } from '../../components/chat/ChatPanel';
import { LeadDetailsDrawer } from '../../components/chat/LeadDetailsDrawer';

type Filter = 'all' | 'unread' | 'archived';
type LeadPatch = Partial<Lead> & { id: string };

export function InboxPage() {
  usePageTitle('Inbox — BrainLead');
  const { user } = useAuth();
  const { instances } = useInstances();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [instanceFilter, setInstanceFilter] = useState<string>('all');
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    async function load() {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user!.id)
        .order('last_activity_at', { ascending: false, nullsFirst: false });
      if (!active) return;
      setLeads((data ?? []) as Lead[]);
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`inbox-leads-${user.id}`)
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

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (filter === 'unread' && !(l.unread_count && l.unread_count > 0)) return false;
      if (filter === 'archived' && !l.is_archived) return false;
      if (filter !== 'archived' && l.is_archived) return false;
      if (q) {
        const hay = `${l.name ?? ''} ${l.phone ?? ''} ${l.last_message ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, search, filter]);

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId],
  );

  const sendMode: SendMode = useMemo(() => {
    if (!selectedLead) return 'manual';
    const inst = instances.find((i) => i.id === selectedLead.instance_id);
    return inst?.send_mode ?? 'manual';
  }, [selectedLead, instances]);

  const handleLeadUpdated = useCallback((patch: LeadPatch) => {
    setLeads((prev) => prev.map((l) => (l.id === patch.id ? { ...l, ...patch } : l)));
  }, []);

  const handleLeadDeleted = useCallback((id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelectedId((curr) => (curr === id ? null : curr));
    setDetailsOpen(false);
  }, []);

  if (!user) return null;

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 min-h-0 flex">
        <div
          className={`${selectedId ? 'hidden lg:flex' : 'flex'} w-full lg:w-[360px] xl:w-[400px] shrink-0 border-r border-white/[0.06] bg-surface-0/40 backdrop-blur-xl flex-col`}
        >
          <div className="px-5 pt-5 pb-3 border-b border-white/[0.06]">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ inbox</span>
            <h1
              className="mt-1.5 font-display font-medium tracking-tightest text-white"
              style={{ fontSize: 'clamp(1.4rem, 2vw, 1.75rem)', lineHeight: 1 }}
            >
              Conversas
            </h1>
          </div>
          <div className="flex-1 min-h-0">
            {loading ? (
              <div className="flex items-center justify-center h-full text-white/40 text-sm">Carregando...</div>
            ) : (
              <ConversationList
                leads={filteredLeads}
                selectedId={selectedId}
                search={search}
                onSearchChange={setSearch}
                onSelect={(l) => setSelectedId(l.id)}
                filter={filter}
                onFilterChange={setFilter}
                instanceFilter={instanceFilter}
                onInstanceFilterChange={setInstanceFilter}
              />
            )}
          </div>
        </div>

        <div className={`${selectedId ? 'flex' : 'hidden lg:flex'} flex-1 min-w-0 flex-col`}>
          {selectedLead ? (
            <>
              <div className="lg:hidden px-4 py-2 border-b border-white/[0.06] bg-surface-0/60 backdrop-blur-xl">
                <button
                  onClick={() => setSelectedId(null)}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <ChatPanel
                  lead={selectedLead}
                  userId={user.id}
                  sendMode={sendMode}
                  onOpenDetails={() => setDetailsOpen(true)}
                  onLeadUpdated={handleLeadUpdated}
                  onLeadDeleted={handleLeadDeleted}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle size={22} strokeWidth={1.5} className="text-white/70" />
                </div>
                <h2 className="text-lg font-medium text-white">Selecione uma conversa</h2>
                <p className="mt-2 text-sm text-white/50">
                  Escolha um lead na lista para abrir o chat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeadDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        lead={selectedLead}
        userId={user.id}
        onLeadUpdated={handleLeadUpdated}
        onLeadDeleted={handleLeadDeleted}
      />
    </div>
  );
}
