import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Send,
  Pause,
  Play,
  Ban,
  Trash2,
  Users,
  CheckCircle2,
  Eye,
  XCircle,
  Clock,
  Search,
  Megaphone,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useCampaignDetail } from '../../lib/useCampaignDetail';
import { CampaignStatus, CampaignRecipientStatus } from '../../lib/types';
import { Button } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

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

const RECIPIENT_STATUS_LABEL: Record<CampaignRecipientStatus, string> = {
  pending: 'Pendente',
  sending: 'Enviando',
  sent: 'Enviado',
  delivered: 'Entregue',
  read: 'Lido',
  failed: 'Falhou',
  skipped: 'Ignorado',
};

const RECIPIENT_STATUS_STYLE: Record<CampaignRecipientStatus, string> = {
  pending: 'bg-white/[0.06] text-white/50',
  sending: 'bg-amber-400/10 text-amber-300',
  sent: 'bg-sky-400/10 text-sky-300',
  delivered: 'bg-emerald-400/10 text-emerald-300',
  read: 'bg-emerald-400/15 text-emerald-300',
  failed: 'bg-rose-500/10 text-rose-300',
  skipped: 'bg-white/[0.04] text-white/40',
};

function formatDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function CampaignDetailPage() {
  usePageTitle('Campanha — BrainLead');
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { campaign, recipients, loading, startSending } = useCampaignDetail(id, user?.id);
  const [recipientSearch, setRecipientSearch] = useState('');
  const [sendingInProgress, setSendingInProgress] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredRecipients = useMemo(() => {
    if (!recipientSearch) return recipients;
    const q = recipientSearch.toLowerCase();
    return recipients.filter(
      (r) =>
        (r.lead_name || '').toLowerCase().includes(q) ||
        (r.phone || '').includes(q),
    );
  }, [recipients, recipientSearch]);

  const stats = useMemo(() => {
    if (!campaign) return { sent: 0, delivered: 0, read: 0, failed: 0, pending: 0 };
    return {
      sent: campaign.sent_count || 0,
      delivered: campaign.delivered_count || 0,
      read: campaign.read_count || 0,
      failed: campaign.failed_count || 0,
      pending: (campaign.total_recipients || 0) - (campaign.sent_count || 0) - (campaign.failed_count || 0),
    };
  }, [campaign]);

  const total = campaign?.total_recipients || 0;
  const pct = total > 0 ? Math.round(((stats.sent + stats.failed) / total) * 100) : 0;

  async function handleStart() {
    setSendError(null);
    setSendingInProgress(true);
    const err = await startSending();
    setSendingInProgress(false);
    if (err) setSendError(err);
  }

  async function handlePause() {
    if (!id) return;
    setActionLoading(true);
    await supabase.from('campaigns').update({ status: 'paused', updated_at: new Date().toISOString() }).eq('id', id);
    setActionLoading(false);
  }

  async function handleResume() {
    setSendError(null);
    setSendingInProgress(true);
    await supabase.from('campaigns').update({ status: 'sending', updated_at: new Date().toISOString() }).eq('id', id);
    const err = await startSending();
    setSendingInProgress(false);
    if (err) setSendError(err);
  }

  async function handleCancel() {
    if (!id || !confirm('Cancelar esta campanha?')) return;
    setActionLoading(true);
    await supabase.from('campaigns').update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', id);
    setActionLoading(false);
  }

  async function handleDelete() {
    if (!id || !confirm('Excluir permanentemente esta campanha?')) return;
    await supabase.from('campaigns').delete().eq('id', id);
    navigate('/dashboard/campaigns');
  }

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/10 border-t-white/70 rounded-full animate-spin" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-white/60 text-sm">Campanha nao encontrada.</p>
        <Button variant="ghost" onClick={() => navigate('/dashboard/campaigns')}>
          <ArrowLeft size={16} /> Voltar
        </Button>
      </div>
    );
  }

  const canStart = campaign.status === 'draft';
  const canPause = campaign.status === 'sending';
  const canResume = campaign.status === 'paused';
  const canCancel = campaign.status === 'scheduled' || campaign.status === 'sending' || campaign.status === 'paused';
  const canDelete = campaign.status === 'draft' || campaign.status === 'cancelled' || campaign.status === 'failed' || campaign.status === 'completed';

  return (
    <div className="absolute inset-0 overflow-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard/campaigns')}
            className="p-2 rounded-xl hover:bg-white/[0.06] transition-all text-white/55 mt-0.5"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                {campaign.name || 'Sem nome'}
              </h1>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full border font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLES[campaign.status]}`}
              >
                {STATUS_LABEL[campaign.status]}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-white/45">
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} />
                Criada em {formatDate(campaign.created_at)}
              </span>
              {campaign.scheduled_at && (
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} />
                  Agendada para {formatDate(campaign.scheduled_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {canStart && (
            <Button onClick={handleStart} loading={sendingInProgress} disabled={actionLoading}>
              <Send size={14} /> Iniciar envio
            </Button>
          )}
          {canResume && (
            <Button onClick={handleResume} loading={sendingInProgress} disabled={actionLoading}>
              <Play size={14} /> Retomar
            </Button>
          )}
          {canPause && (
            <Button variant="secondary" onClick={handlePause} loading={actionLoading} disabled={sendingInProgress}>
              <Pause size={14} /> Pausar
            </Button>
          )}
          {canCancel && (
            <Button variant="secondary" onClick={handleCancel} loading={actionLoading}>
              <Ban size={14} /> Cancelar
            </Button>
          )}
          {canDelete && (
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={14} /> Excluir
            </Button>
          )}
        </div>

        {sendError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-sm text-rose-300">
            {sendError}
          </div>
        )}

        {sendingInProgress && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-sm text-amber-300">
            <RefreshCw size={14} className="animate-spin" />
            Enviando mensagens... Voce pode sair desta pagina, o envio continuara em segundo plano.
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Enviados', value: stats.sent, icon: Send, color: 'text-sky-300' },
            { label: 'Entregues', value: stats.delivered, icon: CheckCircle2, color: 'text-emerald-300' },
            { label: 'Lidos', value: stats.read, icon: Eye, color: 'text-emerald-400' },
            { label: 'Falharam', value: stats.failed, icon: XCircle, color: 'text-rose-300' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={color} />
                <span className="text-[11px] font-medium text-white/50 uppercase tracking-wide">{label}</span>
              </div>
              <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
              <p className="text-[10px] text-white/35 mt-0.5">de {total}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between text-xs text-white/50 mb-2">
              <span className="font-medium">Progresso geral</span>
              <span className="font-mono">{stats.sent + stats.failed}/{total} ({pct}%)</span>
            </div>
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-white/60 to-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
            {stats.pending > 0 && (
              <p className="text-[11px] text-white/35 mt-1.5">{stats.pending} pendentes</p>
            )}
          </div>
        )}

        {/* Campaign details */}
        <div className="glass rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Megaphone size={16} className="text-white/55" />
            Detalhes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div className="flex justify-between sm:flex-col gap-1">
              <span className="text-white/45">Tipo</span>
              <span className="text-white font-medium capitalize">
                {campaign.message_type === 'text' ? 'Texto' : campaign.message_type === 'image' ? 'Imagem' : campaign.message_type === 'audio' ? 'Audio' : 'Documento'}
              </span>
            </div>
            <div className="flex justify-between sm:flex-col gap-1">
              <span className="text-white/45">Intervalo</span>
              <span className="text-white font-medium">{Math.round(campaign.delay_ms / 1000)}s</span>
            </div>
            {campaign.send_window_start && campaign.send_window_end && (
              <div className="flex justify-between sm:flex-col gap-1">
                <span className="text-white/45">Janela de envio</span>
                <span className="text-white font-medium">{campaign.send_window_start} - {campaign.send_window_end}</span>
              </div>
            )}
            {campaign.started_at && (
              <div className="flex justify-between sm:flex-col gap-1">
                <span className="text-white/45">Iniciada em</span>
                <span className="text-white font-medium">{formatDate(campaign.started_at)}</span>
              </div>
            )}
            {campaign.completed_at && (
              <div className="flex justify-between sm:flex-col gap-1">
                <span className="text-white/45">Finalizada em</span>
                <span className="text-white font-medium">{formatDate(campaign.completed_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recipients */}
        <div className="glass rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Users size={16} className="text-white/55" />
              Destinatarios ({recipients.length})
            </h3>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={recipientSearch}
                onChange={(e) => setRecipientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-white/20 bg-white/[0.03]"
              />
            </div>
          </div>

          {recipients.length === 0 ? (
            <p className="text-sm text-white/40 text-center py-6">Nenhum destinatario.</p>
          ) : (
            <div className="max-h-96 overflow-auto rounded-xl border border-white/10">
              {/* Mobile: card list */}
              <div className="sm:hidden divide-y divide-white/[0.06]">
                {filteredRecipients.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{r.lead_name || r.phone}</p>
                      {r.lead_name && <p className="text-[11px] text-white/40 truncate">{r.phone}</p>}
                    </div>
                    <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${RECIPIENT_STATUS_STYLE[r.status]}`}>
                      {RECIPIENT_STATUS_LABEL[r.status]}
                    </span>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <table className="hidden sm:table w-full text-sm">
                <thead className="sticky top-0 bg-white/[0.04]">
                  <tr className="text-left text-xs text-white/50 font-medium">
                    <th className="px-3 py-2">Nome</th>
                    <th className="px-3 py-2">Telefone</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Enviado em</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredRecipients.map((r) => (
                    <tr key={r.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-3 py-2 font-medium text-white">{r.lead_name || '—'}</td>
                      <td className="px-3 py-2 text-white/55">{r.phone}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${RECIPIENT_STATUS_STYLE[r.status]}`}>
                          {RECIPIENT_STATUS_LABEL[r.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-white/40 text-xs">{formatDate(r.sent_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
