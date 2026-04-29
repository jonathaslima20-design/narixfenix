import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Menu, ShieldOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSidebar } from './UserSidebar';
import { useAuth } from '../../lib/AuthContext';
import { SubscriptionProvider, useSubscriptionCtx } from '../../lib/SubscriptionContext';
import { PricingModal } from '../ui/PricingModal';
import { BrainLoader } from '../ui/BrainLoader';
import { ErrorBoundary } from '../ui/ErrorBoundary';

export function UserLayout() {
  const { user, profile, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role === 'admin') return <Navigate to="/admin" replace />;

  return (
    <SubscriptionProvider>
      <UserLayoutInner />
    </SubscriptionProvider>
  );
}

function UserLayoutInner() {
  const { profile } = useAuth();
  const { isBlocked, loading: subLoading, isTrial, daysLeft, sendCount, plan } = useSubscriptionCtx();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const accountDisabled = profile?.is_enabled === false;

  return (
    <div className="obsidian-canvas relative flex h-screen font-sans text-white">
      <div className="noise-layer" aria-hidden="true" />
      {/* Desktop sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <UserSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <UserSidebar onClose={() => setSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-obsidian/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
        <main className="flex-1 min-h-0 relative">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Account disabled overlay */}
      {accountDisabled && (
        <div className="fixed inset-0 z-[60] bg-surface-0/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldOff size={24} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Conta desativada</h2>
            <p className="text-sm text-white/60">
              Sua conta foi desativada pelo administrador. Entre em contato com o suporte para mais informacoes.
            </p>
          </div>
        </div>
      )}

      {/* Paywall modal */}
      {!subLoading && isBlocked && !accountDisabled && (
        <PricingModal
          open
          permanent
          reason={
            (() => {
              const maxSends = plan?.max_sends ?? -1;
              const sendsExhausted = maxSends !== -1 && sendCount >= maxSends;
              const timeExpired = daysLeft <= 0;
              if (sendsExhausted && timeExpired) return 'both_expired' as const;
              if (sendsExhausted) return 'sends_exhausted' as const;
              return 'time_expired' as const;
            })()
          }
        />
      )}
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <BrainLoader size="lg" />
        <p className="text-sm text-white/50">Carregando...</p>
      </div>
    </div>
  );
}
