import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, QrCode, Plus, Trash2, RefreshCw, Pencil, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useInstances, instanceDisplayName } from '../../lib/useInstances';
import { WhatsAppInstance } from '../../lib/types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function getFreshToken(): Promise<string | null> {
  const { data: sessionData } = await supabase.auth.getSession();
  let session = sessionData.session;
  if (session?.expires_at) {
    const expiresInMs = session.expires_at * 1000 - Date.now();
    if (expiresInMs < 60_000) {
      const { data: refreshed } = await supabase.auth.refreshSession();
      if (refreshed.session) session = refreshed.session;
    }
  }
  return session?.access_token ?? null;
}

async function callFn(fn: string, body: Record<string, unknown>) {
  const token = await getFreshToken();
  if (!token) throw new Error('Sessão expirada.');
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fn}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      apikey: SUPABASE_ANON,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const msg = typeof data.error === 'string' ? data.error : `Erro ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function StatusDot({ status }: { status: WhatsAppInstance['status'] }) {
  const colors: Record<WhatsAppInstance['status'], string> = {
    connected: 'bg-emerald-400',
    connecting: 'bg-amber-400 animate-pulse',
    disconnected: 'bg-white/30',
    error: 'bg-rose-400',
  };
  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status]}`} />;
}

function InstanceRow({ instance, onRefresh }: { instance: WhatsAppInstance; onRefresh: () => void }) {
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(instance.label ?? '');
  const [saving, setSaving] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    setError('');
    setQr(null);
    try {
      const res = await callFn('whatsapp-connect', { instanceId: instance.id });
      if (typeof res.qr_code === 'string' && res.qr_code) {
        setQr(res.qr_code);
      }
      onRefresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    setError('');
    try {
      await callFn('whatsapp-disconnect', { instanceId: instance.id });
      onRefresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setDisconnecting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Remover a instância "${instanceDisplayName(instance)}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(true);
    setError('');
    try {
      await supabase.from('whatsapp_instances').delete().eq('id', instance.id);
      onRefresh();
    } catch (e) {
      setError((e as Error).message);
      setDeleting(false);
    }
  }

  async function handleSaveLabel() {
    setSaving(true);
    await supabase
      .from('whatsapp_instances')
      .update({ label: label.trim() || null })
      .eq('id', instance.id);
    setSaving(false);
    setEditing(false);
    onRefresh();
  }

  const isConnected = instance.status === 'connected';
  const isConnecting = instance.status === 'connecting';

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isConnected ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/[0.04] border border-white/[0.08]'}`}>
          {isConnected ? (
            <Wifi size={15} strokeWidth={1.5} className="text-emerald-400" />
          ) : (
            <WifiOff size={15} strokeWidth={1.5} className="text-white/40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex items-center gap-1.5">
              <input
                autoFocus
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveLabel(); if (e.key === 'Escape') setEditing(false); }}
                className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                placeholder="Nome da instância"
              />
              <button onClick={handleSaveLabel} disabled={saving} className="p-1 rounded-lg hover:bg-white/[0.08] text-emerald-400 disabled:opacity-50">
                <Check size={14} />
              </button>
              <button onClick={() => setEditing(false)} className="p-1 rounded-lg hover:bg-white/[0.08] text-white/50">
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-white truncate">{instanceDisplayName(instance)}</span>
              <button onClick={() => { setLabel(instance.label ?? ''); setEditing(true); }} className="p-0.5 rounded hover:bg-white/[0.08] text-white/35 hover:text-white/60 transition-colors">
                <Pencil size={12} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-1.5 mt-0.5">
            <StatusDot status={instance.status} />
            <span className="text-[11px] text-white/45">
              {instance.phone_number || instance.instance_name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isConnected && (
            <button
              onClick={handleConnect}
              disabled={connecting || isConnecting}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/70 hover:text-white text-[11px] font-medium transition-all disabled:opacity-50"
            >
              {connecting ? <RefreshCw size={12} className="animate-spin" /> : <QrCode size={12} />}
              {connecting ? 'Aguarde...' : 'Conectar'}
            </button>
          )}
          {isConnected && (
            <button
              onClick={handleDisconnect}
              disabled={disconnecting}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] text-white/70 hover:text-white text-[11px] font-medium transition-all disabled:opacity-50"
            >
              {disconnecting ? <RefreshCw size={12} className="animate-spin" /> : <WifiOff size={12} />}
              {disconnecting ? 'Aguarde...' : 'Desconectar'}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-white/30 hover:text-rose-400 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {qr && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col items-center gap-2 pt-3 border-t border-white/[0.07]"
          >
            <p className="text-[11px] text-white/55">Escaneie o QR code com o WhatsApp</p>
            <img src={qr} alt="QR Code" className="w-40 h-40 rounded-xl bg-white p-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
}

export function InstancesCard() {
  const { user } = useAuth();
  const { instances, loading, refresh } = useInstances();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  async function handleCreate() {
    if (!user) return;
    setCreating(true);
    setCreateError('');
    try {
      await callFn('whatsapp-connect', { create: true });
      refresh();
    } catch (e) {
      setCreateError((e as Error).message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <Card padding="none">
      <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Instâncias do WhatsApp</h2>
          <p className="text-xs text-white/40 mt-0.5">
            Gerencie as conexões WhatsApp vinculadas à sua conta.
          </p>
        </div>
        <Button size="sm" onClick={handleCreate} loading={creating}>
          <Plus size={14} /> Nova instância
        </Button>
      </div>

      <div className="p-4 space-y-3">
        {loading && (
          <div className="space-y-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        )}

        {!loading && instances.length === 0 && (
          <div className="text-center py-8">
            <WifiOff size={24} strokeWidth={1.5} className="text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/40">Nenhuma instância configurada.</p>
            <p className="text-xs text-white/25 mt-1">Clique em "Nova instância" para começar.</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {instances.map((inst) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.18 }}
            >
              <InstanceRow instance={inst} onRefresh={refresh} />
            </motion.div>
          ))}
        </AnimatePresence>

        {createError && <p className="text-[11px] text-rose-400">{createError}</p>}
      </div>
    </Card>
  );
}
