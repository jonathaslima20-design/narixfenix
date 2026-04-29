import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  MessageSquare,
  Layers,
  Send,
  Sparkles,
  ArrowRight,
  Check,
  CheckCheck,
  Circle,
  Flame,
  Thermometer,
  Snowflake,
  Phone,
  MoreHorizontal,
} from 'lucide-react';

function useMouseSpotlight() {
  useEffect(() => {
    let targetX = 50;
    let targetY = 30;
    let curX = 50;
    let curY = 30;
    let raf = 0;

    const onMove = (e: MouseEvent | globalThis.MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 100;
      targetY = (e.clientY / window.innerHeight) * 100;
    };

    const tick = () => {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      document.documentElement.style.setProperty('--mx', `${curX}%`);
      document.documentElement.style.setProperty('--my', `${curY}%`);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove as (e: globalThis.MouseEvent) => void);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove as (e: globalThis.MouseEvent) => void);
      cancelAnimationFrame(raf);
    };
  }, []);
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * 6;
    const ry = (x - 0.5) * 6;
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl transition-all duration-500 ${
        scrolled ? 'px-4 pt-3' : 'px-6 pt-6'
      }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? 'bg-black/60 backdrop-blur-xl border border-white/5 rounded-full px-4 py-2'
            : 'px-2 py-1'
        }`}
      >
        <a href="#" className="flex items-center gap-2" aria-label="BrainLead">
          <Brain size={18} strokeWidth={1.5} className="text-white/80" />
          <span className="font-mono text-[13px] tracking-tight text-white/90">brainlead</span>
        </a>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-8">
          <a href="#recursos" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors">
            Recursos
          </a>
          <a href="#planos" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors">
            Planos
          </a>
          <a href="#como" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors">
            Como Funciona
          </a>
        </nav>

        <Link
          to="/login"
          className="beam relative rounded-full px-4 py-2 text-[14px] font-medium text-white/90 bg-white/[0.03] border border-white/10"
          style={{ letterSpacing: '-0.01em' }}
        >
          Login
        </Link>
      </div>
    </header>
  );
}

const MOCK_LEADS = [
  { initials: 'MR', name: 'Marina Ribeiro', preview: 'Quero fechar hoje!', time: '14:02', badge: { label: 'Quente', bg: 'bg-red-500/20', text: 'text-red-400', Icon: Flame }, unread: 1 },
  { initials: 'PT', name: 'Pedro Tavares', preview: 'Posso ver os planos?', time: '13:47', badge: { label: 'Morno', bg: 'bg-amber-500/20', text: 'text-amber-400', Icon: Thermometer }, unread: 0 },
  { initials: 'CL', name: 'Carla Lima', preview: 'Ainda não sei...', time: '12:20', badge: { label: 'Frio', bg: 'bg-sky-500/20', text: 'text-sky-400', Icon: Snowflake }, unread: 0 },
  { initials: 'RS', name: 'Rafael Silva', preview: 'Me manda o link', time: '11:55', badge: { label: 'Quente', bg: 'bg-red-500/20', text: 'text-red-400', Icon: Flame }, unread: 3 },
];

const MOCK_MESSAGES = [
  { from: 'lead', text: 'Olá! Vi seu anúncio no instagram' },
  { from: 'user', text: 'Oi Marina! Que bom! Quer conhecer nossa oferta?' },
  { from: 'lead', text: 'Sim! Ainda tá disponível?' },
  { from: 'user', text: 'Sim, posso te mandar os detalhes agora 🎯' },
  { from: 'lead', text: 'Quero fechar hoje!' },
];

function HeroVisual() {
  const [active, setActive] = useState(0);
  const activeLead = MOCK_LEADS[active];
  const BadgeIcon = activeLead.badge.Icon;

  return (
    <div className="reveal relative w-full max-w-4xl mx-auto mt-16 mb-2 select-none" style={{ perspective: '1200px' }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 blur-[80px] opacity-30"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, #10b981 0%, transparent 70%)' }}
      />

      {/* Main app window */}
      <div
        className="relative rounded-2xl border border-white/[0.10] overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)',
          transform: 'rotateX(4deg)',
          transformOrigin: 'top center',
        }}
      >
        {/* Window chrome / title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07]" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <span className="h-3 w-3 rounded-full bg-white/[0.12]" />
          <span className="h-3 w-3 rounded-full bg-white/[0.08]" />
          <span className="h-3 w-3 rounded-full bg-white/[0.06]" />
          <span className="mx-auto font-mono text-[11px] uppercase tracking-[0.18em] text-white/25">brainlead — inbox</span>
        </div>

        <div className="flex" style={{ minHeight: 360 }}>
          {/* Sidebar: lead list */}
          <div className="w-56 shrink-0 border-r border-white/[0.06]" style={{ background: 'rgba(0,0,0,0.18)' }}>
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.05] px-2.5 py-1.5">
                <span className="h-3 w-3 rounded bg-white/[0.12]" />
                <span className="font-mono text-[10px] text-white/25 flex-1">Buscar lead...</span>
              </div>
            </div>
            <div className="px-2 pb-2">
              {MOCK_LEADS.map((lead, i) => (
                <button
                  key={lead.name}
                  onClick={() => setActive(i)}
                  className={`w-full flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-all ${
                    active === i ? 'bg-white/[0.09]' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center font-mono text-[10px] text-white/70">
                    {lead.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[12px] text-white/80 truncate font-medium">{lead.name}</span>
                      <span className="font-mono text-[9px] text-white/25 shrink-0">{lead.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <span className="text-[11px] text-white/35 truncate">{lead.preview}</span>
                      {lead.unread > 0 && (
                        <span className="shrink-0 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center font-mono text-[9px] text-white">
                          {lead.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]" style={{ background: 'rgba(0,0,0,0.10)' }}>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center font-mono text-[10px] text-white/70 shrink-0">
                {activeLead.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-white/90 truncate">{activeLead.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-400/70">online</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${activeLead.badge.bg} ${activeLead.badge.text}`}>
                <BadgeIcon size={9} />
                {activeLead.badge.label}
              </div>
              <button className="p-1 rounded-lg hover:bg-white/[0.06] text-white/20 transition-colors">
                <Phone size={13} />
              </button>
              <button className="p-1 rounded-lg hover:bg-white/[0.06] text-white/20 transition-colors">
                <MoreHorizontal size={13} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-4 space-y-2 overflow-hidden">
              {MOCK_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[68%] rounded-2xl px-3 py-2 text-[12px] leading-[1.45] ${
                      msg.from === 'user'
                        ? 'bg-emerald-400/10 border border-emerald-400/20 text-white/90 rounded-tr-sm'
                        : 'bg-white/[0.05] text-white/75 rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                    {msg.from === 'user' && (
                      <CheckCheck size={10} className="inline ml-1.5 text-emerald-400/60" />
                    )}
                  </div>
                </div>
              ))}
              {/* Typing indicator */}
              <div className="flex items-center gap-1 px-1 pt-1">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/30" style={{ animationDelay: '0ms' }} />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/30" style={{ animationDelay: '150ms' }} />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/30" style={{ animationDelay: '300ms' }} />
              </div>
            </div>

            {/* Composer */}
            <div className="px-4 py-3 border-t border-white/[0.06]" style={{ background: 'rgba(0,0,0,0.12)' }}>
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.05] border border-white/[0.08] px-3 py-2">
                <span className="flex-1 font-mono text-[11px] text-white/20">Escreva uma mensagem...</span>
                <div className="flex items-center gap-1.5">
                  <span className="h-6 w-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Send size={10} className="text-emerald-400" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating lead card */}
      <div
        className="absolute -bottom-4 -right-4 md:right-4 w-52 rounded-2xl border border-white/[0.12] p-3.5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)',
          animation: 'heroFloat 4s ease-in-out infinite',
        }}
      >
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center font-mono text-[10px] text-white/80">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-white/90 truncate">Rafael Silva</div>
            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-medium mt-0.5">
              <Flame size={8} /> Quente
            </div>
          </div>
        </div>
        <div className="hairline" />
        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">mensagens</span>
            <span className="font-mono text-[11px] text-white/70">24</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">sem resposta</span>
            <span className="font-mono text-[11px] text-red-400">3</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">estágio</span>
            <span className="font-mono text-[11px] text-white/60">Proposta</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-48 pb-32 px-6">
      <div className="mx-auto max-w-6xl flex flex-col items-center text-center">
        <div className="reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">
            Conecte. Organize. Converta.
          </span>
        </div>

        <h1
          className="reveal mt-10 font-display font-medium tracking-tightest text-white"
          style={{ lineHeight: 0.92, fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
        >
          <span className="block">Transforme leads em</span>
          <span className="block italic-silver">vendas reais.</span>
        </h1>

        <p className="reveal mt-8 max-w-2xl text-[17px] leading-[1.5] text-white/55">
          Organize seus contatos, gerencie conversas e dispare ofertas de forma simples e eficiente.
        </p>

        <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/cadastro" className="cta-primary group">
            <span>Começar gratuitamente</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/cadastro" className="ghost-btn">Ver planos</Link>
        </div>

        <HeroVisual />

        <div className="reveal mt-20 w-full">
          <div className="hairline" />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['whatsapp nativo', 'funil kanban', 'disparos em massa', 'ia de priorização'].map((label) => (
              <div
                key={label}
                className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35"
              >
                <Circle size={6} className="fill-white/40 text-white/40" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatMockup() {
  return (
    <div className="mt-8 rounded-2xl border border-white/5 bg-black/30 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 font-mono text-[11px] text-white">
          MR
        </div>
        <div className="flex-1">
          <div className="text-[13px] text-white">Marina Ribeiro</div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/80">online</span>
          </div>
        </div>
        <div className="font-mono text-[10px] text-white/40">14:02</div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white/[0.04] px-4 py-2 text-[13px] text-white/80">
          Olá! Vi seu anúncio, ainda dá tempo?
        </div>
        <div className="ml-auto flex max-w-[75%] items-end gap-1 rounded-2xl rounded-tr-sm border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-[13px] text-white/90">
          <span>Sim! Posso te enviar a oferta?</span>
          <CheckCheck size={13} className="text-emerald-400/80 shrink-0" />
        </div>
        <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-white/[0.04] px-4 py-2 text-[13px] text-white/80">
          Quero fechar hoje.
        </div>
        <div className="flex items-center gap-1 px-2 pt-1">
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/50" style={{ animationDelay: '0ms' }} />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/50" style={{ animationDelay: '150ms' }} />
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-white/50" style={{ animationDelay: '300ms' }} />
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">digitando</span>
        </div>
      </div>
    </div>
  );
}

function FunnelMockup() {
  const stages = [
    { label: 'Novo', count: 12, color: 'bg-white' },
    { label: 'Qualificando', count: 7, color: 'bg-amber-400' },
    { label: 'Proposta', count: 4, color: 'bg-sky-400' },
    { label: 'Fechado', count: 3, color: 'bg-emerald-400' },
  ];
  return (
    <div className="mt-6 space-y-2">
      {stages.map((s) => (
        <div key={s.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
          <div className="flex items-center gap-3">
            <span className={`h-2 w-2 rounded-full ${s.color}`} />
            <span className="text-[13px] text-white/80">{s.label}</span>
          </div>
          <span className="font-mono text-[12px] text-white/50">{s.count}</span>
        </div>
      ))}
    </div>
  );
}

function CampaignGraph() {
  return (
    <div className="mt-6 h-32 w-full">
      <svg viewBox="0 0 320 120" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="graph-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="graph-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 0 100 C 40 90, 70 85, 100 75 S 160 55, 200 45 S 260 25, 320 15 L 320 120 L 0 120 Z"
          fill="url(#graph-fill)"
        />
        <path
          d="M 0 100 C 40 90, 70 85, 100 75 S 160 55, 200 45 S 260 25, 320 15"
          fill="none"
          stroke="url(#graph-line)"
          strokeWidth="1.5"
        />
        {[
          [0, 100], [80, 78], [160, 58], [240, 32], [320, 15],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="#0a0a0a" stroke="#c9cdd4" strokeWidth="1" />
        ))}
      </svg>
    </div>
  );
}

function LeadIntelligence() {
  const metrics = [
    { label: 'Quente', value: 92, gradient: 'from-orange-400 to-rose-400' },
    { label: 'Morno', value: 54, gradient: 'from-amber-400 to-orange-400' },
    { label: 'Frio', value: 21, gradient: 'from-sky-400 to-slate-400' },
  ];
  return (
    <div className="mt-6 grid grid-cols-3 gap-3">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{m.label}</div>
          <div className="mt-2 font-display text-2xl font-medium tracking-tight text-white">{m.value}</div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${m.gradient}`}
              style={{ width: `${m.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Bento() {
  return (
    <section id="recursos" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="micro-caps">/ recursos</span>
          <h2
            className="mt-4 font-display font-medium tracking-tightest text-white"
            style={{ lineHeight: 0.96, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            <span className="block">Tudo em um só lugar,</span>
            <span className="block italic-silver">sem fricção.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4">
          <Tilt className="reveal md:col-span-4">
            <div className="glass rounded-3xl p-8 min-h-[420px] relative">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} strokeWidth={1.5} className="text-white/70" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">chat integrado</span>
                </div>
                <span className="font-mono text-[11px] text-white/10">01</span>
              </div>
              <h3 className="mt-6 font-display text-3xl md:text-4xl font-medium tracking-tight leading-[1.05] text-white max-w-xl">
                Conecte seu WhatsApp e centralize sua coleta de leads em um único painel.
              </h3>
              <ChatMockup />
            </div>
          </Tilt>

          <Tilt className="reveal md:col-span-2">
            <div className="glass rounded-3xl p-8 min-h-[420px] flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} strokeWidth={1.5} className="text-white/70" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">gestão de funil</span>
                </div>
                <span className="font-mono text-[11px] text-white/10">02</span>
              </div>
              <FunnelMockup />
              <h3 className="mt-auto pt-6 font-display text-xl md:text-2xl font-medium tracking-tight leading-[1.1] text-white">
                Organize e categorize seus contatos conforme o momento da negociação.
              </h3>
            </div>
          </Tilt>

          <Tilt className="reveal md:col-span-3">
            <div className="glass rounded-3xl p-8 min-h-[300px] flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Send size={16} strokeWidth={1.5} className="text-white/70" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">envios estratégicos</span>
                </div>
                <span className="font-mono text-[11px] text-white/10">03</span>
              </div>
              <CampaignGraph />
              <h3 className="mt-auto pt-6 font-display text-xl md:text-2xl font-medium tracking-tight leading-[1.1] text-white">
                Realize campanhas de massa e alcance seu público com agilidade.
              </h3>
            </div>
          </Tilt>

          <Tilt className="reveal md:col-span-3">
            <div className="glass rounded-3xl p-8 min-h-[300px] flex flex-col">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} strokeWidth={1.5} className="text-white/70" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">inteligência de leads</span>
                </div>
                <span className="font-mono text-[11px] text-white/10">04</span>
              </div>
              <LeadIntelligence />
              <h3 className="mt-auto pt-6 font-display text-xl md:text-2xl font-medium tracking-tight leading-[1.1] text-white">
                Categorize automaticamente seus contatos e priorize quem está pronto para comprar.
              </h3>
            </div>
          </Tilt>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Conecte em segundos',
      desc: 'Integre seu WhatsApp em poucos cliques. Sem APIs complexas, sem configuração técnica.',
    },
    {
      n: '02',
      title: 'Organize seus leads',
      desc: 'Classifique contatos por estágio, tag ou prioridade em um funil visual.',
    },
    {
      n: '03',
      title: 'Dispare campanhas',
      desc: 'Envie ofertas segmentadas para o público certo, no momento certo.',
    },
  ];
  return (
    <section id="como" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal">
          <span className="micro-caps">/ como funciona</span>
          <h2
            className="mt-4 font-display font-medium tracking-tightest text-white"
            style={{ lineHeight: 0.96, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            <span className="block">Três passos.</span>
            <span className="block italic-silver">Zero complicação.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n} className="reveal">
              <div
                className="font-mono leading-none text-white/[0.08]"
                style={{ fontSize: 'clamp(6rem, 10vw, 10rem)' }}
              >
                {s.n}
              </div>
              <div className="mt-6 hairline" />
              <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-white">{s.title}</h3>
              <p className="mt-3 max-w-xs text-[15px] leading-[1.5] text-white/50">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: 'Trial',
      price: 'R$ 0',
      period: '3 dias',
      features: ['3 dias de teste', 'Chat integrado', 'Gestão de funil', 'Campanhas de massa'],
      cta: 'Começar teste',
      variant: 'ghost' as const,
    },
    {
      name: 'Pro Mensal',
      price: 'R$ 49',
      period: '/mês',
      features: ['Envios ilimitados', 'Todas as funções Pro', 'Suporte prioritário', 'Relatórios avançados'],
      cta: 'Assinar mensal',
      variant: 'ghost' as const,
    },
    {
      name: 'Pro Anual',
      price: 'R$ 389',
      period: '/ano',
      badge: 'Economize 34%',
      features: ['Pagamento único', 'Envios ilimitados', 'Todas as funções Pro', 'Suporte dedicado'],
      cta: 'Assinar anual',
      variant: 'primary' as const,
      beam: true,
    },
  ];

  return (
    <section id="planos" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="reveal text-center">
          <span className="micro-caps">/ planos</span>
          <h2
            className="mt-4 font-display font-medium tracking-tightest text-white"
            style={{ lineHeight: 0.96, fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            <span className="block">Preço justo.</span>
            <span className="block italic-silver">Resultado imediato.</span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <Tilt key={p.name} className="reveal">
              <div className={`glass rounded-3xl p-8 min-h-[480px] flex flex-col ${p.beam ? 'beam' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60">{p.name}</span>
                  {p.badge && (
                    <span className="rounded-full bg-white text-black px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
                      {p.badge}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex items-end gap-2">
                  <span className="font-display text-6xl font-medium tracking-tightest text-white leading-none">{p.price}</span>
                  <span className="font-mono text-[12px] text-white/40 pb-2">{p.period}</span>
                </div>

                <div className="mt-6 hairline" />

                <ul className="mt-6 space-y-3 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14px] text-white/75">
                      <Check size={14} strokeWidth={1.8} className="text-white/70 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/cadastro"
                  className={p.variant === 'primary' ? 'cta-primary mt-6 w-full justify-center' : 'ghost-btn mt-6 w-full justify-center'}
                >
                  {p.cta}
                </Link>
              </div>
            </Tilt>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl text-center reveal">
        <h2
          className="font-display font-medium tracking-tightest text-white"
          style={{ lineHeight: 0.92, fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          <span className="block">Pronto para</span>
          <span className="block italic-silver">vender mais?</span>
        </h2>
        <div className="mt-10">
          <Link to="/cadastro" className="cta-primary group">
            <span>Começar gratuitamente</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative px-6 pb-10">
      <div className="mx-auto max-w-6xl">
        <div className="hairline" />
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Brain size={18} strokeWidth={1.5} className="text-white/80" />
            <span className="font-mono text-[13px] text-white/90">brainlead</span>
          </div>
          <nav aria-label="Rodapé" className="flex flex-wrap items-center justify-center gap-6">
            {['recursos', 'planos', 'como funciona', 'privacidade', 'termos'].map((l) => (
              <a
                key={l}
                href={l === 'recursos' ? '#recursos' : l === 'planos' ? '#planos' : l === 'como funciona' ? '#como' : '#'}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 hover:text-white/70 transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-8 text-center micro-caps !text-white/30">
          © 2026 brainlead — todos os direitos reservados
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  useMouseSpotlight();
  useReveal();

  return (
    <div className="obsidian-canvas relative min-h-screen overflow-x-hidden text-white">
      <div className="noise-layer" aria-hidden="true" />
      <Header />
      <main className="relative z-10">
        <Hero />
        <Bento />
        <HowItWorks />
        <Pricing />
        <Closing />
        <Footer />
      </main>
    </div>
  );
}
