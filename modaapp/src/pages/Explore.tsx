import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { Search as SearchIcon, X, Shirt, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';

interface User {
  id: string;
  username: string;
  name: string;
  avatar_url?: string;
}

interface PublicWardrobeItem {
  id: string;
  name: string;
  image_urls: string[];
}

export const Explore = () => {
  const { theme } = useThemeStore();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userItems, setUserItems] = useState<PublicWardrobeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  // Auto-search if query param exists
  useEffect(() => {
      const userParam = searchParams.get('user');
      if (userParam) {
          setQuery(userParam);
          performSearch(userParam);
      }
  }, [searchParams]);

  const performSearch = async (searchTerm: string) => {
      setLoading(true);
      try {
          const res = await api.get(`/users/search?q=${encodeURIComponent(searchTerm)}`);
          setUsers(res.data);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    performSearch(query);
  };

  const handleUserClick = async (user: User) => {
      setSelectedUser(user);
      setLoading(true);
      try {
          const res = await api.get(`/wardrobe/users/${user.id}`);
          setUserItems(res.data);
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const addToMyLook = (item: PublicWardrobeItem) => {
      navigate('/create-look', { state: { importedItem: item } });
  };

  return (
    <div className={`min-h-screen p-4 transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Explorar Guarda-Roupas</h1>
        
        <form onSubmit={handleSearch} className="relative mb-8">
            <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input 
                type="text" 
                placeholder="Buscar usuário..." 
                value={query}
                onChange={e => setQuery(e.target.value)}
                className={`w-full rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDark 
                    ? 'bg-[#1a1a1a] text-white placeholder-gray-500' 
                    : 'bg-white border border-gray-300 text-black placeholder-gray-400'
                }`}
            />
        </form>

        {!selectedUser ? (
            <div className="space-y-4">
                {users.length === 0 && !loading && query && (
                    <div className="text-center text-gray-500 py-10">Nenhum usuário encontrado.</div>
                )}
                
                {users.map(user => (
                    <div 
                        key={user.id} 
                        onClick={() => handleUserClick(user)} 
                        className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                            isDark 
                            ? 'bg-[#121212] hover:bg-[#1a1a1a]' 
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`w-12 h-12 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            {user.avatar_url && <img src={user.avatar_url} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <h3 className="font-bold">{user.username}</h3>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div>
                <button onClick={() => setSelectedUser(null)} className={`mb-4 flex items-center gap-2 hover:opacity-80 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
                    <X size={20} /> Voltar
                </button>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className={`w-16 h-16 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        {selectedUser.avatar_url && <img src={selectedUser.avatar_url} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{selectedUser.username}</h2>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Guarda-Roupa Público</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div></div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {userItems.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">Este usuário não possui itens públicos.</div>
                        )}
                        {userItems.map(item => (
                            <div key={item.id} className={`aspect-[3/4] rounded-lg relative group overflow-hidden ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'}`}>
                                {item.image_urls[0] ? (
                                    <img src={item.image_urls[0]} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Shirt size={32} className={isDark ? 'text-gray-700' : 'text-gray-400'} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => addToMyLook(item)} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-gray-100">
                                        <Plus size={14} /> Usar no Look
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};