import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Thermometer, Snowflake, MessageCircle, Megaphone, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { usePageTitle } from '../../hooks/usePageTitle';

interface TempStat {
  cold: number;
  warm: number;
  hot: number;
}

export function DashboardHome() {
  usePageTitle('Visão Geral — BrainLead');
  const { user, profile } = useAuth();
  const [temp, setTemp] = useState<TempStat>({ cold: 0, warm: 0, hot: 0 });
  const [totalLeads, setTotalLeads] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const userId = user.id;
    async function load() {
      const { data } = await supabase.rpc('get_user_lead_stats', { user_uuid: userId });
      const row = Array.isArray(data) ? data[0] : data;
      setTemp({
        cold: row?.cold ?? 0,
        warm: row?.warm ?? 0,
        hot: row?.hot ?? 0,
      });
      setTotalLeads(row?.total ?? 0);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const total = temp.cold + temp.warm + temp.hot;
  const tiles = [
    { key: 'hot', label: 'Quentes', value: temp.hot, Icon: Flame, gradient: 'from-orange-400 to-rose-400', accent: 'text-rose-300' },
    { key: 'warm', label: 'Mornos', value: temp.warm, Icon: Thermometer, gradient: 'from-amber-400 to-orange-400', accent: 'text-amber-300' },
    { key: 'cold', label: 'Frios', value: temp.cold, Icon: Snowflake, gradient: 'from-sky-400 to-slate-400', accent: 'text-sky-300' },
  ];

  const shortcuts: { to: string; label: string; desc: string; Icon: LucideIcon }[] = [
    { to: '/dashboard/leads', label: 'Inbox', desc: 'Converse e qualifique leads em tempo real.', Icon: MessageCircle },
    { to: '/dashboard/crm', label: 'Gestão de Leads', desc: 'Organize o pipeline e acompanhe a temperatura.', Icon: Users },
    { to: '/dashboard/campaigns', label: 'Campanhas', desc: 'Dispare ofertas em massa com agendamento.', Icon: Megaphone },
  ];

  const firstName = (profile?.full_name || profile?.email || '').split(' ')[0] || '';

  return (
    <div className="absolute inset-0 overflow-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ início</span>
          <h1
            className="mt-3 font-display font-medium tracking-tightest text-white"
            style={{ lineHeight: 0.96, fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            <span className="block">Bem-vindo{firstName ? `,` : '.'}</span>
            <span className="block italic-silver">{firstName ? `${firstName}.` : 'vamos qualificar.'}</span>
          </h1>
          <p className="mt-4 text-[14px] text-white/55 max-w-md">
            Sua central de qualificação de leads e disparos de alta eficiência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {tiles.map((t, i) => {
            const pct = total > 0 ? Math.round((t.value / total) * 100) : 0;
            return (
              <motion.div
                key={t.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.5 }}
                className="metric-tile"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <t.Icon size={14} strokeWidth={1.5} className={t.accent} />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {t.label}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-white/30">{pct}%</span>
                </div>
                <div
                  className="mt-5 font-display font-medium tracking-tightest text-white"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', lineHeight: 1 }}
                >
                  {loading ? (
                    <span className="inline-block h-10 w-20 rounded bg-white/[0.06] animate-pulse" />
                  ) : (
                    t.value.toLocaleString('pt-BR')
                  )}
                </div>
                <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${t.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-6 flex items-end justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ atalhos</span>
          <span className="font-mono text-[10px] text-white/30">{totalLeads.toLocaleString('pt-BR')} leads no total</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shortcuts.map((s, i) => (
            <motion.div
              key={s.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.2, duration: 0.5 }}
            >
              <Link
                to={s.to}
                className="glass block rounded-3xl p-6 group transition-colors hover:border-white/[0.14]"
              >
                <div className="flex items-center gap-2 mb-5">
                  <s.Icon size={14} strokeWidth={1.5} className="text-white/70" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                    {s.label}
                  </span>
                </div>
                <p className="text-[15px] text-white/85 leading-snug">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 group-hover:text-white transition-colors">
                  Abrir
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
