import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { Input } from '../components/ui/Input';
import { BrainLoader } from '../components/ui/BrainLoader';

export function AuthPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<'login' | 'register'>(
    location.pathname === '/cadastro' ? 'register' : 'login'
  );
  const [form, setForm] = useState({ email: '', password: '', full_name: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = mode === 'register' ? 'Criar Conta — BrainLead' : 'Entrar — BrainLead';
    return () => { document.title = 'BrainLead'; };
  }, [mode]);

  if (loading) return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <BrainLoader size="lg" />
    </div>
  );
  if (user) {
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.full_name, role: 'user' } },
        });
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
        navigate(profileData?.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="obsidian-canvas relative min-h-screen text-white overflow-hidden font-sans">
      <div className="noise-layer" aria-hidden="true" />

      <Link
        to="/"
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 hover:text-white transition-colors"
      >
        <ArrowLeft size={12} />
        Voltar
      </Link>

      <div className="relative z-[1] min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center justify-center mb-5">
              <Brain size={22} strokeWidth={1.5} className="text-white/80" />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
              / {mode === 'login' ? 'acesso' : 'novo cadastro'}
            </span>
            <h1
              className="mt-3 font-display font-medium tracking-tightest text-white"
              style={{ lineHeight: 0.96, fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
            >
              {mode === 'login' ? (
                <>
                  <span className="block">Bem-vindo</span>
                  <span className="block italic-silver">de volta.</span>
                </>
              ) : (
                <>
                  <span className="block">Crie sua</span>
                  <span className="block italic-silver">conta.</span>
                </>
              )}
            </h1>
            <p className="mt-4 text-[14px] text-white/55 leading-relaxed max-w-xs">
              {mode === 'login'
                ? 'Entre para continuar qualificando leads e disparando ofertas.'
                : 'Comece gratuitamente e organize seus leads em minutos.'}
            </p>
          </div>

          <div className="beam rounded-3xl">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {mode === 'register' && (
                    <motion.div
                      key="name"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        label="Nome completo"
                        name="full_name"
                        type="text"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Seu nome"
                        icon={<User size={15} />}
                        required
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Input
                  label="E-mail"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  icon={<Mail size={15} />}
                  required
                />

                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  icon={<Lock size={15} />}
                  required
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[13px] text-rose-200 bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="cta-primary w-full justify-center disabled:opacity-60"
                >
                  <span>{submitting ? 'Enviando...' : mode === 'login' ? 'Entrar' : 'Criar conta'}</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40 text-center mt-6">
            {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-white/80 hover:text-white transition-colors"
            >
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
