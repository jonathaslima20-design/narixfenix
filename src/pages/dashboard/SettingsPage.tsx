import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SyncStatusCard } from '../../components/settings/SyncStatusCard';
import { SendModeSelector } from '../../components/settings/SendModeSelector';
import { WipeChatDialog } from '../../components/settings/WipeChatDialog';

export function SettingsPage() {
  usePageTitle('Configurações — BrainLead');
  const { user } = useAuth();
  const [wipeOpen, setWipeOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="absolute inset-0 overflow-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ configurações</span>
          <h1
            className="mt-1.5 font-display font-medium tracking-tightest text-white"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1 }}
          >
            Configurações
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Gerencie sincronização do WhatsApp, modo de envio e higiene dos dados.
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
              / sincronização
            </span>
            <SyncStatusCard userId={user.id} />
          </section>

          <section>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
              / modo de envio
            </span>
            <SendModeSelector />
          </section>

          <section>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
              / zona de risco
            </span>
            <div className="glass rounded-3xl p-5 border-rose-500/20">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                  <AlertTriangle size={16} strokeWidth={1.5} className="text-rose-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-medium text-white">Limpar histórico de chat</h3>
                  <p className="mt-1 text-[12px] text-white/55">
                    Remove todos os leads e mensagens. Esta ação não pode ser desfeita.
                  </p>
                </div>
                <button
                  onClick={() => setWipeOpen(true)}
                  className="shrink-0 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:border-rose-500/60 text-rose-300 text-[12px] font-medium transition-colors"
                >
                  Limpar
                </button>
              </div>
            </div>
          </section>
        </div>
      </motion.div>

      <WipeChatDialog
        open={wipeOpen}
        userId={user.id}
        onClose={() => setWipeOpen(false)}
        onWiped={() => setWipeOpen(false)}
      />
    </div>
  );
}
