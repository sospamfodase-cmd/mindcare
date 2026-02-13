import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Bell, Lock, Globe, Moon, Sun, Shield, HelpCircle, ChevronRight, LogOut, Trash2 } from 'lucide-react';

export const Settings = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [notifications, setNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const isDark = theme === 'dark';

  const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
      <div className={`mb-8 ${isDark ? 'text-white' : 'text-black'}`}>
          <h3 className="text-sm font-bold uppercase text-gray-500 mb-4 px-4">{title}</h3>
          <div className={`rounded-xl overflow-hidden border ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-white border-gray-200'}`}>
              {children}
          </div>
      </div>
  );

  const SettingsItem = ({ icon: Icon, label, value, onClick, danger = false }: any) => (
      <div 
        onClick={onClick}
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors border-b last:border-0 ${
            isDark ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-100 hover:bg-gray-50'
        }`}
      >
          <div className="flex items-center gap-3">
              <Icon size={20} className={danger ? 'text-red-500' : (isDark ? 'text-gray-400' : 'text-gray-600')} />
              <span className={danger ? 'text-red-500 font-medium' : ''}>{label}</span>
          </div>
          <div className="flex items-center gap-2">
              {value}
              {typeof value === 'string' && <ChevronRight size={16} className="text-gray-500" />}
          </div>
      </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
      <div 
        onClick={onChange}
        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${checked ? 'bg-blue-500' : 'bg-gray-600'}`}
      >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${checked ? 'left-7' : 'left-1'}`} />
      </div>
  );

  const handleDeleteAccount = () => {
      if (confirm('Tem certeza que deseja excluir sua conta? Esta ação é irreversível.')) {
          // Call API to delete account
          alert('Conta excluída (Simulado).');
          logout();
      }
  };

  return (
    <div className={`max-w-2xl mx-auto py-8 px-4 ${isDark ? 'text-white' : 'text-black'}`}>
      <h1 className="text-2xl font-bold mb-8 px-4">Configurações</h1>

      <SettingsSection title="Preferências">
          <SettingsItem 
            icon={isDark ? Moon : Sun} 
            label="Tema Escuro" 
            value={<Toggle checked={isDark} onChange={toggleTheme} />} 
          />
          <SettingsItem 
            icon={Globe} 
            label="Idioma" 
            value="Português (BR)" 
          />
      </SettingsSection>

      <SettingsSection title="Privacidade e Segurança">
          <SettingsItem 
            icon={Lock} 
            label="Conta Privada" 
            value={<Toggle checked={privateAccount} onChange={() => setPrivateAccount(!privateAccount)} />} 
          />
          <SettingsItem 
            icon={Bell} 
            label="Notificações Push" 
            value={<Toggle checked={notifications} onChange={() => setNotifications(!notifications)} />} 
          />
          <SettingsItem 
            icon={Shield} 
            label="Segurança da Conta" 
            value="Alterar Senha" 
          />
      </SettingsSection>

      <SettingsSection title="Suporte e Sobre">
          <SettingsItem icon={HelpCircle} label="Ajuda" />
          <SettingsItem icon={HelpCircle} label="Sobre o App" value="v1.0.0" />
      </SettingsSection>

      <SettingsSection title="Login">
          <SettingsItem icon={LogOut} label="Sair da Conta" onClick={logout} />
          <SettingsItem icon={Trash2} label="Excluir Conta" danger onClick={handleDeleteAccount} />
      </SettingsSection>
    </div>
  );
};
