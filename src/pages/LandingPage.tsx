import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  MessageSquare,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  Circle,
  Flame,
  Thermometer,
  Snowflake,
  DollarSign,
  ShoppingCart,
  Send,
  CheckCheck,
  MessageCircle,
  TrendingUp,
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

const W = 1000;
const H = 160;
const MID = H / 2;

// Main wave path — varied amplitudes for natural rhythm
const MAIN_PATH = `M 0 ${MID}
  C 60 ${MID - 20}, 110 ${MID + 52}, 190 ${MID + 18}
  C 270 ${MID - 15}, 310 ${MID - 55}, 400 ${MID - 28}
  C 490 ${MID - 2}, 530 ${MID + 48}, 610 ${MID + 22}
  C 690 ${MID - 4}, 740 ${MID - 50}, 820 ${MID - 30}
  C 900 ${MID - 10}, 950 ${MID + 14}, ${W} ${MID - 4}`;

// Ghost echo — same shape, offset up slightly, low opacity
const ECHO_PATH = `M 0 ${MID - 14}
  C 60 ${MID - 34}, 110 ${MID + 38}, 190 ${MID + 4}
  C 270 ${MID - 29}, 310 ${MID - 69}, 400 ${MID - 42}
  C 490 ${MID - 16}, 530 ${MID + 34}, 610 ${MID + 8}
  C 690 ${MID - 18}, 740 ${MID - 64}, 820 ${MID - 44}
  C 900 ${MID - 24}, 950 ${MID}, ${W} ${MID - 18}`;

const NODES: { cx: number; cy: number; delay: number; label: string; above: boolean }[] = [
  { cx: 190, cy: MID + 18,  delay: 0.1, label: 'captado',     above: false },
  { cx: 400, cy: MID - 28,  delay: 0.5, label: 'qualificado', above: true  },
  { cx: 610, cy: MID + 22,  delay: 0.9, label: 'proposta',    above: false },
  { cx: 820, cy: MID - 30,  delay: 1.3, label: 'fechado',     above: true  },
];

function useCounter(target: number, duration = 1800, startDelay = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    t = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, startDelay);
    return () => clearTimeout(t);
  }, [target, duration, startDelay]);
  return value;
}

function FunnelWave() {
  const revenue = useCounter(49300);

  return (
    <div
      className="reveal relative w-full max-w-5xl mx-auto mt-16 select-none"
      style={{ height: H + 80 }}
    >
      {/* Dot grid with radial mask so edges dissolve */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Ambient glow under wave center */}
      <div
        className="pointer-events-none absolute"
        style={{
          left: '20%', right: '20%', top: '30%', bottom: '10%',
          background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.06) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32" style={{ background: 'linear-gradient(to right, #050505 40%, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32" style={{ background: 'linear-gradient(to left, #050505 40%, transparent)' }} />

      {/* Left chip — leads source */}
      <div
        className="absolute left-0 flex items-center gap-2.5 rounded-full border px-3.5 py-2"
        style={{
          top: H / 2 + 10,
          borderColor: 'rgba(255,255,255,0.08)',
          background: 'rgba(10,10,10,0.75)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.5)',
        }}
      >
        <div className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </div>
        <MessageCircle size={13} className="text-white/50" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">leads entrando</span>
      </div>

      {/* SVG wave */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-x-0 w-full"
        style={{ height: H, top: 40 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient along wave: cool white → emerald */}
          <linearGradient id="wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.25)" />
            <stop offset="45%"  stopColor="rgba(52,211,153,0.7)" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>

          <linearGradient id="echo-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.08)" />
          </linearGradient>

          {/* Soft glow filter */}
          <filter id="wave-glow" x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Node ring glow */}
          <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>{`
            @keyframes flowDash {
              from { stroke-dashoffset: 2200; }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes echoFlow {
              from { stroke-dashoffset: 2200; }
              to   { stroke-dashoffset: 0; }
            }
            @keyframes nodeRingPulse {
              0%, 100% { r: 9; opacity: 0.15; }
              50%       { r: 13; opacity: 0.28; }
            }
            @keyframes nodeDotPulse {
              0%, 100% { r: 3.5; }
              50%       { r: 5; }
            }
            @keyframes labelFade {
              from { opacity: 0; transform: translateY(4px); }
              to   { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </defs>

        {/* Echo / shadow wave */}
        <path
          d={ECHO_PATH}
          fill="none"
          stroke="url(#echo-grad)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2200"
          style={{ animation: 'echoFlow 3.4s cubic-bezier(0.4,0,0.2,1) 0.3s forwards', opacity: 0 }}
        />

        {/* Glow halo behind main line */}
        <path
          d={MAIN_PATH}
          fill="none"
          stroke="rgba(52,211,153,0.22)"
          strokeWidth="10"
          filter="url(#wave-glow)"
        />

        {/* Main wave line */}
        <path
          d={MAIN_PATH}
          fill="none"
          stroke="url(#wave-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="2200"
          style={{ animation: 'flowDash 2.8s cubic-bezier(0.4,0,0.2,1) forwards' }}
        />

        {/* Arrowhead at end */}
        <polyline
          points={`${W - 16},${MID - 4 - 10} ${W},${MID - 4} ${W - 16},${MID - 4 + 10}`}
          fill="none"
          stroke="#34d399"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Nodes with labels */}
        {NODES.map((n, i) => (
          <g key={i}>
            {/* Pulsing ring */}
            <circle
              cx={n.cx} cy={n.cy} r={9}
              fill="rgba(52,211,153,0.15)"
              filter="url(#node-glow)"
              style={{ animation: `nodeRingPulse 2.4s ease-in-out ${n.delay}s infinite` }}
            />
            {/* Inner dot */}
            <circle
              cx={n.cx} cy={n.cy} r={3.5}
              fill="#34d399"
              style={{ animation: `nodeDotPulse 2.4s ease-in-out ${n.delay}s infinite` }}
            />
            {/* Tick mark connecting to label */}
            <line
              x1={n.cx} y1={n.above ? n.cy - 13 : n.cy + 13}
              x2={n.cx} y2={n.above ? n.cy - 26 : n.cy + 26}
              stroke="rgba(52,211,153,0.3)" strokeWidth="1" strokeDasharray="2 2"
            />
            {/* Label */}
            <text
              x={n.cx} y={n.above ? n.cy - 32 : n.cy + 38}
              textAnchor="middle"
              fontSize="9"
              letterSpacing="0.14em"
              fill="rgba(255,255,255,0.38)"
              fontFamily="'JetBrains Mono', 'Fira Mono', monospace"
              style={{
                textTransform: 'uppercase',
                animation: `labelFade 0.5s ease-out ${n.delay + 0.3}s both`,
              }}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Right chip — revenue counter */}
      <div
        className="absolute right-0 flex items-center gap-3 rounded-2xl border px-4 py-3"
        style={{
          top: H / 2 - 4,
          borderColor: 'rgba(52,211,153,0.2)',
          background: 'rgba(6,6,6,0.82)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 0 1px rgba(52,211,153,0.06), 0 8px 32px rgba(0,0,0,0.6), 0 0 24px rgba(52,211,153,0.08)',
        }}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 border border-emerald-400/20">
          <TrendingUp size={13} className="text-emerald-400" />
        </div>
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">conversões</div>
          <div className="font-mono text-[15px] font-medium text-emerald-400 leading-tight tabular-nums">
            R$ {revenue.toLocaleString('pt-BR')}
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

        <FunnelWave />

        <div className="reveal mt-8 w-full">
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
