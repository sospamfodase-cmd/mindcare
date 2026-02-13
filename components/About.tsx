import React from 'react';
import { GraduationCap, Award, User, HeartPulse, Brain, Activity, Users, ClipboardCheck, Stethoscope, Lightbulb } from 'lucide-react';
import { CRM, RQE } from '../constants';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden scroll-mt-28">
       {/* Background Editorial Accents */}
       <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -skew-x-12 translate-x-1/2 pointer-events-none -z-0"></div>
       <div className="absolute top-1/4 -left-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- SECTION 1: DR. BIANCA (PROFESSIONAL PROFILE) --- */}
        <div className="flex flex-col lg:flex-row gap-20 items-start mb-40">
            
            <div className="flex-1 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-brand-300"></div>
                  <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs">A Profissional</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-serif text-slate-900 leading-[1.1] tracking-tight">
                  Dra. Bianca <br />
                  <span className="italic font-normal text-brand-700">Amaral Fernandes</span>
                </h2>
              </div>
              
              <div className="space-y-8 text-slate-600 text-lg leading-relaxed max-w-xl">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 inline-block">Filosofia de Atendimento</h3>
                  <p>
                    A prática clínica é conduzida com base em medicina fundamentada em evidências científicas, ética profissional e respeito absoluto à individualidade de cada paciente.
                  </p>
                  <p>
                    Médica formada pela Universidade do Oeste Paulista (UNOESTE), com atuação voltada à saúde mental, integrando abordagem clínica criteriosa e visão ampliada do cuidado.
                  </p>
                </div>

                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="group flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white group-hover:border-brand-600 transition-all duration-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-black tracking-widest">Inscrição Profissional</span>
                      <span className="text-slate-900 font-bold tracking-tight">{CRM}</span>
                      {RQE && <span className="text-slate-500 text-xs ml-2">| {RQE}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full relative">
               <div className="bg-slate-900 rounded-[2.5rem] p-10 lg:p-14 text-white relative overflow-hidden group">
                 {/* Decorative background for the box */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 
                 <h3 className="text-2xl font-serif mb-10 flex items-center gap-4 relative z-10">
                   <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-brand-400" />
                   </div>
                   Especialidades & Atuação
                 </h3>
                 
                 <p className="text-slate-400 mb-10 italic text-lg relative z-10">
                   Abordagem técnica e humanizada no acompanhamento de adultos:
                 </p>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
                   {[
                     'Transtornos de ansiedade',
                     'Transtornos depressivos',
                     'Transtorno Bipolar',
                     'TDAH em adultos',
                     'TEA em adultos',
                     'Transtornos de personalidade',
                     'Insônia e distúrbios do sono',
                     'Burnout e esgotamento',
                     'Desregulação emocional'
                   ].map((item, index) => (
                     <div key={index} className="flex items-center gap-3 py-2 border-b border-white/5 group-hover:border-white/10 transition-colors">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                       <span className="text-slate-300 font-medium text-sm tracking-wide">{item}</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="mt-12 pt-8 border-t border-white/10 relative z-10">
                   <p className="text-xs text-slate-500 uppercase tracking-[0.2em] font-bold">
                     Indicação terapêutica individualizada após avaliação clínica.
                   </p>
                 </div>
               </div>
            </div>
        </div>

        {/* --- SECTION 2: MINDCARE FOUNDATION --- */}
        <div className="relative mb-40 w-full">
          <div className="absolute inset-0 bg-brand-50/50 rounded-[4rem] -rotate-1 scale-105 pointer-events-none hidden lg:block"></div>
          
          <div className="relative z-10 py-12 lg:py-24 px-0 lg:px-16">
            <div className="max-w-4xl mx-auto text-center mb-20 px-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-sm border border-brand-100 mb-8">
                <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></div>
                <span className="text-brand-700 font-black tracking-widest uppercase text-[10px]">Institucional</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-serif text-slate-900 mb-8 leading-tight">
                A Fundação da <span className="italic">MindCare</span>
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed font-light">
                Propósito de ampliar o acesso à saúde mental, promover acolhimento qualificado e oferecer um cuidado verdadeiramente integral.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10 mb-20 px-6">
               {[
                 { 
                   icon: Lightbulb, 
                   title: 'Metas Possíveis', 
                   desc: 'Transformação de vidas por meio de metas estruturadas e adaptadas à realidade de cada pessoa.' 
                 },
                 { 
                   icon: Users, 
                   title: 'Equidade', 
                   desc: 'Atuação oferecendo cuidado proporcional às necessidades e possibilidades de cada paciente.' 
                 },
                 { 
                   icon: HeartPulse, 
                   title: 'Caminhos Sólidos', 
                   desc: 'Construção de trajetórias reais e sustentáveis, sem promessas irreais.' 
                 }
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                   <div className="w-16 h-16 bg-slate-50 text-brand-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-500">
                     <item.icon className="w-8 h-8" />
                   </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{item.title}</h4>
                   <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
                 </div>
               ))}
            </div>

            {/* Multidisciplinary Team & Commitment */}
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-stretch bg-white lg:rounded-[3rem] p-6 lg:p-16 shadow-2xl shadow-brand-900/5 border-y lg:border border-slate-50">
              <div className="lg:col-span-7 space-y-8 flex flex-col justify-center">
                <div className="space-y-4">
                  <h3 className="text-3xl font-serif text-slate-900 flex items-center gap-4">
                    <Users className="w-8 h-8 text-brand-600" />
                    Equipe Multidisciplinar
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    A equipe da MindCare foi formada com criterioso cuidado e elevado comprometimento técnico.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Psicologia', 'Nutrição', 'Fisioterapia', 'Educação Física'].map((area) => (
                    <div key={area} className="flex items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                      <span className="text-slate-900 font-bold text-sm tracking-tight">{area}</span>
                    </div>
                  ))}
                </div>
                
                <blockquote className="border-l-4 border-brand-200 pl-6 py-2">
                  <p className="text-slate-500 italic text-lg">
                    "Caminhamos na mesma direção. Falamos a mesma linguagem clínica. Compartilhamos o mesmo propósito."
                  </p>
                </blockquote>
              </div>

              <div className="lg:col-span-5 bg-brand-900 rounded-[2.5rem] p-8 lg:p-14 text-white space-y-10 relative overflow-hidden flex flex-col justify-center min-h-[450px]">
                 <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                 <div className="absolute top-0 left-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
                 
                 <div className="relative z-10 space-y-6">
                   <h3 className="text-3xl font-serif flex items-center gap-4">
                     <Award className="w-8 h-8 text-brand-400" />
                     Nosso Compromisso
                   </h3>
                   <p className="text-brand-100/90 text-lg leading-relaxed">
                     Oferecer cuidado técnico, responsável e individualizado, visando estabilidade clínica, melhora funcional e qualidade de vida.
                   </p>
                 </div>
                 
                 <div className="relative z-10 grid grid-cols-1 gap-4 pt-4">
                   {['Ciência', 'Ética', 'Responsabilidade', 'Propósito'].map((val) => (
                     <span key={val} className="w-full text-center px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all border border-white/10 shadow-lg backdrop-blur-sm">
                       {val}
                     </span>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: PROCESS / METHODOLOGY --- */}
        <div className="space-y-24">
           <div className="text-center max-w-3xl mx-auto space-y-6">
             <div className="flex justify-center items-center gap-4">
               <div className="h-px w-8 bg-brand-200"></div>
               <span className="text-brand-600 font-black tracking-[0.3em] uppercase text-[10px]">Metodologia</span>
               <div className="h-px w-8 bg-brand-200"></div>
             </div>
             <h2 className="text-4xl lg:text-5xl font-serif text-slate-900">
               Jornada do <span className="italic">Cuidado</span>
             </h2>
           </div>

           <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Connecting line for desktop */}
             <div className="hidden md:block absolute top-24 left-0 w-full h-px bg-slate-100 -z-0"></div>

             {[
               {
                 step: '01',
                 icon: ClipboardCheck,
                 title: 'Avaliação Clínica',
                 items: ['História clínica e emocional', 'Sintomas e evolução', 'Sono e alimentação', 'Rotina e contexto', 'Histórico familiar'],
                 footer: 'A saúde mental é multifatorial. Consideramos fatores biológicos e ambientais.'
               },
               {
                 step: '02',
                 icon: Brain,
                 title: 'Diagnóstico Responsável',
                 desc: 'Definição baseada em critérios técnicos (DSM-5-TR), associada à análise funcional criteriosa.',
                 warning: 'Evitamos rótulos precipitados sem investigação profunda.',
                 footer: 'Solicitamos exames complementares quando necessário para precisão clínica.'
               },
               {
                 step: '03',
                 icon: Stethoscope,
                 title: 'Plano Terapêutico',
                 desc: 'Cuidado compartilhado e dinâmico, adaptado à evolução de cada fase do tratamento.',
                 footer: 'O foco é a remissão de sintomas e a recuperação da funcionalidade plena.'
               }
             ].map((process, idx) => (
               <div key={idx} className="relative z-10 group">
                 <div className="mb-12 flex justify-between items-end">
                    <span className="text-7xl font-serif text-slate-100 group-hover:text-brand-50 transition-colors duration-500 leading-none">{process.step}</span>
                    <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-brand-600 border border-slate-50 group-hover:scale-110 transition-transform duration-500">
                      <process.icon className="w-8 h-8" />
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{process.title}</h3>
                    
                    {process.items && (
                      <ul className="space-y-3">
                        {process.items.map(item => (
                          <li key={item} className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                            <div className="w-1 h-1 rounded-full bg-brand-400"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {process.desc && (
                      <p className="text-slate-500 leading-relaxed text-sm">{process.desc}</p>
                    )}

                    {process.warning && (
                      <div className="bg-slate-900 p-5 rounded-2xl border-l-4 border-brand-500">
                        <p className="text-brand-100 text-xs font-bold leading-relaxed uppercase tracking-wider">
                          {process.warning}
                        </p>
                      </div>
                    )}

                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest pt-6 border-t border-slate-100">
                      {process.footer}
                    </p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </section>
  );
};