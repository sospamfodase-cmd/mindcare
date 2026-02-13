import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Quote } from 'lucide-react';
 import { DOCTOR_NAME, CRM, PLACEHOLDER_AVATAR, SOCIAL_URLS } from '../constants';
import { getRandomInsight } from '../utils/insights';

export const Hero: React.FC = () => {
  const [insight, setInsight] = useState<string>("");

  useEffect(() => {
    setInsight(getRandomInsight());
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex flex-col lg:flex-row items-center overflow-hidden bg-white">
      {/* Background Image - Desktop & Mobile */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(max-width: 768px)" srcSet="/images/hero-banner-mobile.png" />
          <img 
            src="/images/hero-banner.png" 
            alt="Dra. Bianca Amaral Fernandes" 
            className="w-full h-full object-cover object-center lg:object-[center_20%] transition-transform duration-1000"
          />
        </picture>
        {/* Editorial Overlays */}
        {/* Desktop: Gradient from left to right for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent hidden lg:block"></div>
        {/* Mobile: Double Gradient for extreme top/bottom contrast */}
        <div className="absolute inset-0 lg:hidden">
          {/* Top gradient for title readability */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white via-white/40 to-transparent"></div>
          {/* Bottom gradient for buttons readability */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full flex flex-col justify-between pt-24 pb-10 lg:py-0">
        <div className="w-full lg:w-3/5 xl:w-1/2 flex flex-col h-full justify-between">
          {/* Text Content - Positioned as high as possible on mobile */}
          <div className="text-left">
            <div className="inline-flex items-center gap-3 mb-4 px-1">
              <div className="w-12 h-[1px] bg-brand-400"></div>
              <span className="text-xs font-black text-brand-600 uppercase tracking-[0.3em]">Medicina Integrativa</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-serif text-slate-900 leading-[0.9] tracking-tighter mb-6">
              Cuidado que <br/>
              <span className="italic font-normal text-brand-700">transforma.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-800 lg:text-slate-600 max-w-xl leading-relaxed font-medium drop-shadow-sm lg:drop-shadow-none">
              Bem-vindo ao {DOCTOR_NAME}. Um refúgio de acolhimento onde a ciência e a humanidade se unem para restaurar seu equilíbrio.
            </p>
            <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mt-4 opacity-70">
              {CRM}
            </p>

            {/* AI Insight - Editorial Style - Hidden on Mobile */}
            <div className="relative mt-8 group max-w-lg hidden lg:block">
              <div className="absolute -inset-2 bg-brand-100/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white/50 shadow-sm overflow-hidden">
                <Quote className="absolute -top-4 -right-4 w-24 h-24 text-slate-100 opacity-50" />
                <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-4">Pensamento do Dia</p>
                <p className="text-slate-800 font-serif italic text-xl leading-relaxed relative z-10">
                  "{insight}"
                </p>
              </div>
            </div>
          </div>

          {/* Buttons - Positioned as low as possible on mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
            <a 
              href={SOCIAL_URLS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-5 bg-brand-700 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-brand-800 transition-all shadow-xl shadow-brand-700/20 hover:shadow-brand-700/40 hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Agendar Consulta
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#about"
              className="w-full sm:w-auto px-10 py-5 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all hover:-translate-y-1 text-center"
            >
              Sobre a Dra.
            </a>
          </div>
        </div>

        {/* Floating Detail for Desktop - repositioned */}
        <div className="absolute bottom-12 right-0 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 hidden xl:block animate-float">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-black text-xl">
              +3
            </div>
            <div>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Anos de</p>
              <p className="text-slate-900 font-bold">Experiência Clínica</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};