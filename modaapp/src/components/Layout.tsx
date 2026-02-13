import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Shirt, Layers, User, PlusSquare, LogOut, Bell, Search, Compass, Instagram, MessageCircle, Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const Layout = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const isDark = theme === 'dark';
  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
    <Link 
      to={to} 
      className={`p-3 rounded-lg flex items-center gap-4 transition-all group ${
        active 
        ? (isDark ? 'font-bold text-white' : 'font-bold text-black') 
        : (isDark ? 'font-normal text-white hover:bg-white/10' : 'font-normal text-black hover:bg-black/5')
      }`}
    >
      <Icon size={24} className={`${active ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
      <span className="hidden md:block text-base">{label}</span>
    </Link>
  );

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      {/* Mobile Top Bar */}
      <div className={`md:hidden p-4 flex justify-between items-center sticky top-0 z-20 border-b ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <h1 className="text-xl font-bold font-serif italic">ModaSocial</h1>
        <div className="flex items-center gap-4">
           <button onClick={toggleTheme}>
               {isDark ? <Sun size={24} /> : <Moon size={24} />}
           </button>
           <Link to="/notifications" className="relative">
              <Bell size={24} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
           </Link>
           {/* <Link to="/messages">
              <MessageCircle size={24} />
           </Link> */}
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <nav className={`hidden md:flex fixed top-0 left-0 w-[244px] h-screen border-r z-20 flex-col p-4 transition-colors ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="mb-8 px-3 pt-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold font-serif italic hidden xl:block">ModaSocial</h1>
          <Instagram size={24} className="xl:hidden" />
          <button onClick={toggleTheme} className="hidden xl:block p-2 rounded-full hover:bg-gray-800/10">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <NavItem to="/" icon={Home} label="Página inicial" active={isActive('/')} />
          <NavItem to="/search" icon={Search} label="Pesquisa" active={isActive('/search')} />
          <NavItem to="/explore" icon={Compass} label="Explorar" active={isActive('/explore')} />
          <NavItem to="/wardrobe" icon={Shirt} label="Guarda-Roupa" active={isActive('/wardrobe')} />
          <NavItem to="/create-look" icon={Layers} label="Criar Look" active={isActive('/create-look')} />
          <NavItem to="/notifications" icon={Bell} label="Notificações" active={isActive('/notifications')} />
          <NavItem to="/create-post" icon={PlusSquare} label="Criar" active={isActive('/create-post')} />
          <NavItem to="/profile" icon={User} label="Perfil" active={isActive('/profile')} />
          <NavItem to="/settings" icon={SettingsIcon} label="Configurações" active={isActive('/settings')} />
        </div>

        <div className={`mt-auto pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
           <button onClick={logout} className="w-full p-3 rounded-lg flex items-center gap-4 hover:bg-red-500/10 text-red-500 transition-colors">
            <LogOut size={24} />
            <span className="hidden md:block text-base">Sair</span>
          </button>
        </div>
      </nav>

      {/* Bottom Nav (Mobile) */}
      <nav className={`md:hidden fixed bottom-0 left-0 w-full border-t z-20 flex justify-around p-3 pb-5 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <Link to="/" className={isActive('/') ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}><Home size={26} strokeWidth={isActive('/') ? 3 : 2} /></Link>
          <Link to="/search" className={isActive('/search') ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}><Search size={26} strokeWidth={isActive('/search') ? 3 : 2} /></Link>
          <Link to="/create-post" className={isActive('/create-post') ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}><PlusSquare size={26} strokeWidth={isActive('/create-post') ? 3 : 2} /></Link>
          <Link to="/wardrobe" className={isActive('/wardrobe') ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}><Shirt size={26} strokeWidth={isActive('/wardrobe') ? 3 : 2} /></Link>
          <Link to="/profile" className={isActive('/profile') ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}>
            <div className={`w-7 h-7 rounded-full overflow-hidden border-2 ${isActive('/profile') ? (isDark ? 'border-white' : 'border-black') : 'border-transparent'}`}>
               {user?.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="bg-gray-700 w-full h-full" />}
            </div>
          </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 md:ml-[244px] w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
