import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Loader2, Send, Sparkles } from 'lucide-react';
import { getRandomInsight } from '../utils/insights';
import { blogService } from '../services/blogService';
import toast from 'react-hot-toast';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [previewTitle, setPreviewTitle] = useState('Conteúdos exclusivos semanais sobre saúde mental.');

  useEffect(() => {
    // We can also use a variation or different logic for the newsletter title if needed
    // For now, let's keep a stable high-quality title or use the same source
    setPreviewTitle("Mindcare Weekly: Dicas de bem-estar e saúde mental.");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    try {
      const result = await blogService.addSubscriber(email);
      
      if (result.success) {
        setStatus('success');
        setEmail('');
        toast.success(result.message);
        
        // Reset success message after 3 seconds
        setTimeout(() => {
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('idle');
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('idle');
      toast.error('Erro ao se inscrever. Tente novamente.');
    }
  };

  return (
    <section id="newsletter" className="py-24 relative overflow-hidden bg-[#faf9f6] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="relative bg-white rounded-[2.5rem] p-8 md:p-16 lg:p-20 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-50/30 to-transparent pointer-events-none"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-100/40 rounded-full blur-3xl"></div>
          
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Text Content */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-[1px] bg-brand-400"></div>
                <span className="text-xs font-bold text-brand-600 uppercase tracking-[0.2em]">Newsletter Semanal</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 tracking-tight leading-[1.1]">
                Mindcare <span className="text-brand-700 italic font-normal">Weekly</span>
              </h2>
              
              <p className="text-slate-600 text-lg md:text-xl mb-8 leading-relaxed max-w-xl font-light">
                Insights sobre <span className="text-slate-900 font-medium">saúde mental</span> e <span className="text-slate-900 font-medium">neurociência</span> aplicados ao seu bem-estar diário.
              </p>

              {previewTitle && (
                <div className="mb-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group max-w-lg">
                  <div className="flex items-center gap-2 mb-3 text-brand-600">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Destaque da Próxima Edição</span>
                  </div>
                  <p className="text-slate-800 font-serif italic text-lg">
                    "{previewTitle}"
                  </p>
                </div>
              )}
            </div>

            {/* Form Column */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="newsletter-email" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                      Seu melhor e-mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@exemplo.com"
                        className="w-full h-14 pl-12 pr-6 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`
                      w-full h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-3
                      ${status === 'success' ? 'bg-green-600 text-white' : 'bg-brand-700 text-white hover:bg-brand-800 shadow-lg shadow-brand-700/20'}
                      disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]
                    `}
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : status === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Inscrição Confirmada</span>
                      </>
                    ) : (
                      <>
                        <span>Inscrever na Newsletter</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400 font-medium">
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <span>Zero spam. Cancele quando quiser.</span>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};