import React from 'react';
import { CLINIC_NAME, DOCTOR_NAME, SOCIAL_URLS } from '../constants';
import { Instagram, Video, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 py-24 border-t border-slate-800 relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-20">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-serif text-white tracking-tight">{CLINIC_NAME}</h3>
              <p className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px]">{DOCTOR_NAME}</p>
            </div>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
              Um espaço dedicado à saúde mental com ética, ciência e acolhimento humano.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Conecte-se</h4>
              <div className="flex flex-col gap-4">
                <a href={SOCIAL_URLS.instagramMindcare} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-slate-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-600 transition-all">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">Instagram Clínica</span>
                </a>
                <a href={SOCIAL_URLS.instagramPersonal} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-slate-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-600 transition-all">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">Instagram Pessoal</span>
                </a>
                <a href={SOCIAL_URLS.tiktok} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-slate-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-brand-600 group-hover:border-brand-600 transition-all">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium tracking-wide">TikTok</span>
                </a>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest text-xs">Atendimento</h4>
              <div className="space-y-2">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Consulte disponibilidade para <br />
                  atendimentos presenciais e online.
                </p>
                <div className="pt-4">
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></div>
                    <span className="text-white text-[10px] font-black uppercase tracking-widest">Agenda Aberta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-center items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <p className="text-slate-500 text-xs font-medium tracking-wide text-center md:text-left">
              &copy; {currentYear} {CLINIC_NAME}. Todos os direitos reservados.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                Desenvolvido com <Heart className="w-3 h-3 text-brand-500 fill-current" /> para excelência no cuidado
              </p>
              <div className="hidden md:block w-px h-3 bg-slate-800"></div>
              <a 
                href="https://hydracode.com.br" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-500 hover:text-white text-[10px] uppercase tracking-[0.2em] font-black transition-colors flex items-center gap-2 group"
              >
                Feito por 
                <span className="text-slate-400 group-hover:text-brand-400 transition-colors">HydraCode</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};