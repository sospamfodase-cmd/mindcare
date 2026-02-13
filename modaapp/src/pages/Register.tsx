import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', formData);
      const { user, access_token } = response.data;
      
      login(user, access_token);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className={`p-8 rounded-2xl shadow-sm w-full max-w-md ${isDark ? 'bg-[#121212] border border-gray-800' : 'bg-white'}`}>
        <h1 className={`text-3xl font-serif font-bold mb-2 text-center ${isDark ? 'text-white' : 'text-black'}`}>Criar Conta</h1>
        <p className={`text-center mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Entre para o mundo da moda</p>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-4 text-sm border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nome Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                isDark 
                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-black'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Nome de Usuário</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                isDark 
                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-black'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                isDark 
                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-black'
              }`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Senha</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all ${
                isDark 
                ? 'bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-500' 
                : 'bg-white border-gray-300 text-black'
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                isDark
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <p className={`mt-6 text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Já tem uma conta?{' '}
          <Link to="/login" className={`font-semibold hover:underline ${isDark ? 'text-white' : 'text-black'}`}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
};
