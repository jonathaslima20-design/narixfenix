import { motion } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { InstancesCard } from '../../components/settings/InstancesCard';
import { CategoriesCard } from '../../components/settings/CategoriesCard';

export function SettingsPage() {
  usePageTitle('Configurações — BrainLead');
  const { user } = useAuth();

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
            Gerencie as instâncias do WhatsApp e as categorias dos seus leads.
          </p>
        </div>

        <div className="space-y-6">
          <section>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
              / instâncias
            </span>
            <InstancesCard />
          </section>

          <section>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
              / categorias
            </span>
            <CategoriesCard />
          </section>
        </div>
      </motion.div>
    </div>
  );
}
