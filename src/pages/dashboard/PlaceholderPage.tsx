import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

export function PlaceholderPage({ title, tag }: { title: string; tag: string }) {
  return (
    <div className="relative p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 14, filter: 'blur(14px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ {tag}</span>
        <h1
          className="mt-3 font-display font-medium tracking-tightest text-white"
          style={{ lineHeight: 0.96, fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          <span className="block">{title}</span>
          <span className="block italic-silver">em construção.</span>
        </h1>
        <div className="mt-10 glass rounded-3xl p-8 flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <Construction size={18} strokeWidth={1.5} className="text-white/70" />
          </div>
          <div>
            <p className="text-[14px] text-white/85">Esta área está sendo preparada.</p>
            <p className="text-[13px] text-white/45 mt-1">Em breve aqui você verá os controles completos de {title.toLowerCase()}.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
