import React, { useState, useEffect } from 'react';
import { Menu, X, Brain, LogIn, LayoutDashboard } from 'lucide-react';
import { CLINIC_NAME, SOCIAL_URLS } from '../constants';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Blog', path: '/blog' },
  ];

  // If on home page, add anchor links
  if (location.pathname === '/') {
    navItems.splice(1, 0, { label: 'Quem Sou', path: '#about' });
    navItems.splice(3, 0, { label: 'Links', path: '#links' });
  }

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border-b border-slate-100' : 'bg-transparent'
    }`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-white focus:text-slate-900 focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg text-xs font-bold uppercase tracking-widest">Pular para conteúdo</a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative overflow-hidden w-10 h-10 flex items-center justify-center bg-transparent rounded-xl transition-transform duration-500 group-hover:rotate-12">
              <img src="/images/4.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-widest text-slate-900 leading-none uppercase">{CLINIC_NAME}</span>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.3em] mt-1">Mindcare</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return item.path.startsWith('#') ? (
                  <a
                    key={item.label}
                    href={item.path}
                    className="text-slate-500 hover:text-brand-700 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-1 left-4 right-4 h-[1px] bg-brand-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors relative group ${
                      isActive ? 'text-brand-700' : 'text-slate-500 hover:text-brand-700'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute bottom-1 left-4 right-4 h-[1px] bg-brand-600 transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                  </Link>
                );
              })}
            </div>
            
            <a 
              href={SOCIAL_URLS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-brand-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-brand-800 transition-all shadow-lg shadow-brand-700/10 hover:shadow-brand-700/20 active:scale-95"
            >
              Agendar
            </a>
          </div>
          
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-xl text-slate-900 bg-white/50 backdrop-blur-sm border border-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2 sm:px-3">
            {navItems.map((item) => (
              item.path.startsWith('#') ? (
                <a
                  key={item.label}
                  href={item.path}
                  onClick={() => setIsOpen(false)}
                  className="text-slate-600 hover:text-brand-600 hover:bg-brand-50 block px-3 py-3 rounded-lg text-base font-medium transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'text-brand-600 bg-brand-50 font-bold' 
                      : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
            
            {user && (
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold text-base bg-brand-50 px-3 py-3 rounded-lg transition-colors mt-4"
              >
                <LayoutDashboard className="w-5 h-5" /> Painel Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
