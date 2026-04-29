import { motion } from 'framer-motion';
import { Mail, MessageCircle, ChevronRight } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

const FAQS = [
  {
    q: 'Como importo meus leads?',
    a: 'Em "Gestão de Leads" clique em "Importar". Você pode colar uma lista de contatos, enviar um arquivo CSV/TXT ou importar diretamente das conversas do WhatsApp.',
  },
  {
    q: 'Como funciona a temperatura dos leads?',
    a: 'Os leads ficam organizados em colunas (Frio, Morno, Quente, Fechado). Arraste os cards para mover um lead entre estágios e atualizar a temperatura automaticamente.',
  },
  {
    q: 'O que é o modo de envio?',
    a: 'O modo de envio define como as respostas saem: Manual (você envia tudo), Aprovação (sugestões aparecem para revisar antes de enviar) e Automático. Configure em Configurações → Modo de envio.',
  },
  {
    q: 'Como crio uma campanha?',
    a: 'Em "Campanhas" clique em "Nova campanha". Escreva a mensagem, escolha destinatários por tags ou categoria, defina o horário de envio e o ritmo entre mensagens.',
  },
  {
    q: 'Meus envios acabaram, e agora?',
    a: 'Você verá o aviso de limite no menu lateral. Faça upgrade do plano diretamente pelo botão "Upgrade" para liberar mais envios e recursos.',
  },
  {
    q: 'Posso limpar todo o histórico?',
    a: 'Sim, em Configurações → Zona de risco. A limpeza apaga todos os leads e mensagens e não pode ser desfeita.',
  },
];

export function HelpPage() {
  usePageTitle('Ajuda — BrainLead');

  return (
    <div className="absolute inset-0 overflow-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">/ ajuda</span>
          <h1
            className="mt-1.5 font-display font-medium tracking-tightest text-white"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1 }}
          >
            Central de ajuda
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Respostas rápidas para começar a usar a plataforma.
          </p>
        </div>

        <section className="mb-8">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
            / perguntas frequentes
          </span>
          <div className="space-y-2">
            {FAQS.map((item, i) => (
              <details
                key={i}
                className="glass rounded-2xl group open:border-white/[0.12]"
              >
                <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3">
                  <span className="text-[14px] font-medium text-white">{item.q}</span>
                  <ChevronRight
                    size={14}
                    className="text-white/40 group-open:rotate-90 transition-transform shrink-0"
                  />
                </summary>
                <div className="px-4 pb-4 -mt-1">
                  <p className="text-[13px] text-white/65 leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-3 block">
            / ainda com dúvidas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noreferrer"
              className="glass rounded-3xl p-5 hover:border-white/[0.14] transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle size={14} strokeWidth={1.5} className="text-emerald-300" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  whatsapp
                </span>
              </div>
              <p className="text-[14px] text-white">Suporte em tempo real</p>
              <p className="mt-1 text-[12px] text-white/50">Tempo médio de resposta: poucos minutos.</p>
            </a>
            <a
              href="mailto:suporte@brainlead.com"
              className="glass rounded-3xl p-5 hover:border-white/[0.14] transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Mail size={14} strokeWidth={1.5} className="text-sky-300" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  email
                </span>
              </div>
              <p className="text-[14px] text-white">suporte@brainlead.com</p>
              <p className="mt-1 text-[12px] text-white/50">Respondemos em até 24h úteis.</p>
            </a>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
