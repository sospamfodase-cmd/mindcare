import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { QUICK_LINKS } from '../constants';

export const LinkGrid: React.FC = () => {
  return (
    <section id="links" className="py-32 relative scroll-mt-28 overflow-hidden bg-[#faf9f6]">
      {/* Subtle Texture */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Content Column */}
          <div className="w-full lg:w-7/12 order-2 lg:order-1">
            <div className="text-center lg:text-left mb-16">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white border border-slate-200 mb-6 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                <span className="text-slate-500 font-bold tracking-[0.15em] uppercase text-[10px]">Canais de Atendimento</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Agende sua <br className="hidden lg:block" />
                <span className="text-brand-600">Sessão</span>
              </h2>
              <p className="text-slate-500 text-lg md:text-xl max-w-2xl lg:max-w-none font-medium leading-relaxed">
                Escolha o canal mais adequado para iniciar sua jornada de cuidado com a saúde mental e bem-estar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                const isPrimary = link.primary;

                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      group relative p-8 rounded-[2rem] border transition-all duration-500
                      flex flex-col justify-between h-full
                      ${isPrimary 
                        ? 'bg-brand-700 border-brand-600 shadow-[0_20px_40px_-10px_rgba(0,53,95,0.2)] hover:-translate-y-2' 
                        : 'bg-white border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] hover:-translate-y-2'
                      }
                    `}
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`
                          p-4 rounded-2xl transition-all duration-500
                          ${isPrimary ? 'bg-white/10 text-white' : 'bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white'}
                        `}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <ArrowUpRight className={`w-5 h-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 ${isPrimary ? 'text-white/40' : 'text-slate-300'}`} />
                      </div>
                      
                      <h3 className={`text-xl font-bold mb-2 ${isPrimary ? 'text-white' : 'text-slate-900'}`}>
                        {link.title}
                      </h3>
                      <p className={`text-sm font-medium leading-relaxed ${isPrimary ? 'text-brand-100/80' : 'text-slate-500'}`}>
                        {link.subtitle}
                      </p>
                    </div>

                    {isPrimary && (
                      <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                        <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Agendar via WhatsApp</span>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <ExternalLink className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Image Column - Editorial Portrait */}
          <div className="w-full lg:w-5/12 flex justify-center lg:items-center order-1 lg:order-2">
            <div className="relative">
              {/* Refined Frame */}
              <div className="relative bg-white p-4 pb-16 rounded-2xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-50">
                  <img 
                    src="/images/IMG_8955.png" 
                    alt="Dra. Bianca Amaral" 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 shadow-[inner_0_0_100px_rgba(0,0,0,0.05)] pointer-events-none"></div>
                </div>
                
                {/* Editorial Caption */}
                <div className="absolute bottom-4 left-8 right-8">
                  <p className="text-[10px] font-black text-brand-700 uppercase tracking-[0.3em] mb-1">Médica Psiquiatra</p>
                  <p className="text-xl font-serif text-slate-800 italic">Dra. Bianca Amaral</p>
                </div>

                {/* Corner detail */}
                <div className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-slate-200 rotate-45 absolute"></div>
                  <div className="w-full h-[1px] bg-slate-200 -rotate-45 absolute"></div>
                </div>
              </div>

              {/* Minimal Decorative Accent */}
              <div className="absolute -z-10 -bottom-8 -right-8 w-64 h-64 bg-secondary-100 rounded-full blur-[80px] opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};