import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Megaphone, Trash2, Ban, Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCampaigns } from '../../lib/useCampaigns';
import { Campaign, CampaignStatus } from '../../lib/types';

const STATUS_LABEL: Record<CampaignStatus, string> = {
  draft: 'Rascunho',
  scheduled: 'Agendada',
  sending: 'Enviando',
  paused: 'Pausada',
  completed: 'Concluída',
  failed: 'Falhou',
  cancelled: 'Cancelada',
};

const STATUS_STYLES: Record<CampaignStatus, string> = {
  draft: 'bg-white/[0.06] text-white/70 border-white/10',
  scheduled: 'bg-sky-400/10 text-sky-300 border-sky-400/20',
  sending: 'bg-amber-400/10 text-amber-300 border-amber-400/20',
  paused: 'bg-white/[0.04] text-white/60 border-white/10',
  completed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20',
  failed: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  cancelled: 'bg-white/[0.04] text-white/40 border-white/10',
};

const FILTERS: { key: 'all' | CampaignStatus; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'draft', label: 'Rascunhos' },
  { key: 'scheduled', label: 'Agendadas' },
  { key: 'sending', label: 'Enviando' },
  { key: 'completed', label: 'Concluídas' },
];

function formatDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function CampaignRow({
  campaign,
  onCancel,
  onDelete,
}: {
  campaign: Campaign;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const total = campaign.total_recipients || 0;
  const sent = campaign.sent_count || 0;
  const pct = total > 0 ? Math.round((sent / total) * 100) : 0;
  const canCancel = campaign.status === 'scheduled' || campaign.status === 'sending' || campaign.status === 'paused';

  return (
    <Link to={`/dashboard/campaigns/${campaign.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-5 cursor-pointer hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-[15px] font-medium text-white truncate">{campaign.name || 'Sem nome'}</h3>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[9px] uppercase tracking-wider ${STATUS_STYLES[campaign.status]}`}
              >
                {STATUS_LABEL[campaign.status]}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <Users size={12} strokeWidth={1.5} />
                {total.toLocaleString('pt-BR')} destinatários
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={12} strokeWidth={1.5} />
                {campaign.scheduled_at ? formatDate(campaign.scheduled_at) : formatDate(campaign.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {canCancel && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancel(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/20 text-[12px] text-white/70 hover:text-white transition-colors"
              >
                <Ban size={12} />
                Cancelar
              </button>
            )}
            {(campaign.status === 'draft' || campaign.status === 'cancelled' || campaign.status === 'failed' || campaign.status === 'completed') && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-rose-500/40 hover:text-rose-300 text-[12px] text-white/60 transition-colors"
              >
                <Trash2 size={12} />
                Excluir
              </button>
            )}
          </div>
        </div>
        {total > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5">
              <span>Progresso</span>
              <span>{sent}/{total} · {pct}%</span>
            </div>
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-white/70 to-white"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </Link>
  );
}

export function CampaignsPage() {
  usePageTitle('Campanhas — BrainLead');
  const { user } = useAuth();
  const { campaigns, loading, deleteCampaign, updateStatus } = useCampaigns(user?.id);
  const [filter, setFilter] = useState<'all' | CampaignStatus>('all');

  const visible = useMemo(() => {
    if (filter === 'all') return campaigns;
    return campaigns.filter((c) => c.status === filter);
  }, [campaigns, filter]);

  async function handleCancel(id: string) {
    await updateStatus(id, 'cancelled');
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta campanha?')) return;
    await deleteCampaign(id);
  }

  return (
    <div className="absolute inset-0 overflow-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-5xl mx-auto"
      >
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ campanhas</span>
            <h1
              className="mt-1.5 font-display font-medium tracking-tightest text-white"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1 }}
            >
              Campanhas
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Dispare mensagens em massa com agendamento e controle de ritmo.
            </p>
          </div>
          <Link
            to="/dashboard/campaigns/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors self-start"
          >
            <Plus size={14} />
            Nova campanha
          </Link>
        </div>

        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 py-1.5 rounded-full border font-mono text-[10px] uppercase tracking-wider transition-colors ${
                filter === f.key
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.03] text-white/60 border-white/[0.08] hover:border-white/20 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-white/40 text-sm">Carregando...</div>
        ) : visible.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Megaphone size={22} strokeWidth={1.5} className="text-white/70" />
            </div>
            <h3 className="text-lg font-medium text-white">Nenhuma campanha por aqui</h3>
            <p className="mt-2 text-sm text-white/50">
              Crie sua primeira campanha para começar a disparar mensagens.
            </p>
            <Link
              to="/dashboard/campaigns/new"
              className="inline-flex items-center gap-1.5 mt-5 px-4 py-2 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <Plus size={14} />
              Nova campanha
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((c) => (
              <CampaignRow
                key={c.id}
                campaign={c}
                onCancel={() => handleCancel(c.id)}
                onDelete={() => handleDelete(c.id)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
