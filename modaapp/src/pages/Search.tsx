import React, { useState } from 'react';
import api from '../lib/api';
import { Search as SearchIcon, Hash, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';

interface SearchResult {
  users: any[];
  posts: any[];
}

export const Search = () => {
  const { theme } = useThemeStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);
  const isDark = theme === 'dark';

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      // Fetch users and posts in parallel
      const [postsRes, usersRes] = await Promise.all([
          api.get('/posts'),
          api.get(`/users/search?q=${encodeURIComponent(query)}`)
      ]);

      const filteredPosts = postsRes.data.filter((p: any) => 
          p.caption?.toLowerCase().includes(query.toLowerCase())
      );

      setResults({ users: usersRes.data, posts: filteredPosts });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto min-h-screen transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <div className={`sticky top-0 z-10 p-4 border-b transition-colors ${isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar usuários ou #hashtags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full rounded-full py-2.5 pl-10 pr-4 outline-none transition-all ${
                isDark 
                ? 'bg-[#1a1a1a] text-white focus:ring-2 focus:ring-gray-700' 
                : 'bg-gray-100 text-black focus:ring-2 focus:ring-black/5'
            }`}
          />
        </form>
      </div>

      <div className="p-4">
        {loading ? (
            <div className="text-center py-8 text-gray-500">Pesquisando...</div>
        ) : (
            <div className="space-y-6">
                {/* Users Section */}
                {results.users.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-4">Usuários</h3>
                        <div className="flex flex-col gap-3">
                            {results.users.map(user => (
                                <Link to={`/explore?user=${user.username}`} key={user.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'}`}>
                                    <div className={`w-10 h-10 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                        {user.avatar_url && <img src={user.avatar_url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{user.username}</div>
                                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.name}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Posts Section */}
                {results.posts.length > 0 && (
                    <div>
                        <h3 className="font-bold mb-4">Posts</h3>
                        <div className="grid grid-cols-3 gap-1">
                            {results.posts.map(post => (
                                <div key={post.id} className={`aspect-square relative group cursor-pointer ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                                    <img src={post.image_urls[0]} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {results.posts.length === 0 && results.users.length === 0 && query && (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        Nenhum resultado para "{query}"
                    </div>
                )}
                
                {!query && (
                    <div className="col-span-full">
                        <h3 className="font-bold mb-4">Populares</h3>
                        <div className="flex flex-wrap gap-2">
                            {['#moda', '#verao', '#estilo', '#ootd', '#lookdodia'].map(tag => (
                                <button 
                                    key={tag}
                                    onClick={() => { setQuery(tag); handleSearch({ preventDefault: () => {} } as any); }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                        isDark 
                                        ? 'bg-[#1a1a1a] hover:bg-[#262626] text-white' 
                                        : 'bg-white hover:bg-gray-100 text-black border border-gray-200'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};
