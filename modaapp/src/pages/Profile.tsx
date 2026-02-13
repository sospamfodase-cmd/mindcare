import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import { Settings, Grid, Bookmark, Tag, X, Camera, Edit2, Layers, Shirt } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { useThemeStore } from '../store/themeStore';
import { Link } from 'react-router-dom';

export const Profile = () => {
  const { user, setUser } = useAuthStore();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'wardrobe' | 'looks'>('posts');
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState({ followers_count: 0, following_count: 0, posts_count: 0 });
  const [loading, setLoading] = useState(true);
  
  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
      name: '',
      username: '',
      bio: '',
      website: '',
      avatar_url: '',
      banner_url: ''
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    if (user?.id) {
        fetchStats();
        fetchContent();
        setEditForm({
            name: user.name || '',
            username: user.username || '',
            bio: user.bio || '',
            website: user.website || '',
            avatar_url: user.avatar_url || '',
            banner_url: user.banner_url || ''
        });
    }
  }, [user?.id, activeTab]);

  const fetchStats = async () => {
      try {
          const res = await api.get(`/users/${user?.id}/stats`);
          setStats(res.data);
      } catch (error) {
          console.error("Failed to fetch stats", error);
      }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      if (activeTab === 'posts') {
        const res = await api.get('/looks'); // Using looks as posts for now
        const userLooks = res.data.filter((l: any) => l.creator_id === user?.id);
        setItems(userLooks);
      } else if (activeTab === 'wardrobe') {
        const res = await api.get('/wardrobe');
        setItems(res.data);
      } else if (activeTab === 'looks') {
         // Assuming we distinguish looks from posts, but for now they are similar
         // Let's filter looks differently or use same endpoint
         const res = await api.get('/looks'); 
         const userLooks = res.data.filter((l: any) => l.creator_id === user?.id);
         setItems(userLooks);
      }
    } catch (error) {
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.put(`/users/${user?.id}`, editForm);
          if (user) {
            setUser({ ...user, ...editForm });
          }
          setIsEditModalOpen(false);
      } catch (error) {
          console.error("Error updating profile", error);
          alert("Erro ao atualizar perfil.");
      }
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Banner */}
      <div className="relative w-full aspect-[16/5] md:aspect-[16/4] bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
          {user?.banner_url && (
              <img src={user.banner_url} alt="Banner" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="relative -mt-16 md:-mt-24 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
             {/* Avatar */}
             <div className="relative group">
                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-fuchsia-600 ${isDark ? 'bg-black' : 'bg-white'}`}>
                    <div className={`w-full h-full rounded-full border-4 overflow-hidden ${isDark ? 'border-black bg-gray-800' : 'border-white bg-gray-200'}`}>
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-3xl">
                                {user?.username?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Edit2 size={20} />
                </button>
             </div>

             {/* Actions & Stats */}
             <div className="flex-1 flex flex-col items-center md:items-start gap-4 mb-2 w-full">
                 <div className="flex flex-col md:flex-row items-center gap-4 w-full">
                     <h1 className="text-2xl font-bold">{user?.username}</h1>
                     <div className="flex gap-2">
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${isDark ? 'bg-[#363636] hover:bg-[#262626]' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            Editar perfil
                        </button>
                        <Link to="/settings" className="p-1.5"><Settings size={24} /></Link>
                     </div>
                 </div>

                 <div className="flex gap-8 text-base">
                    <div className="text-center md:text-left"><span className="font-bold">{stats.posts_count}</span> <span className="text-gray-500">publicações</span></div>
                    <div className="text-center md:text-left"><span className="font-bold">{stats.followers_count}</span> <span className="text-gray-500">seguidores</span></div>
                    <div className="text-center md:text-left"><span className="font-bold">{stats.following_count}</span> <span className="text-gray-500">seguindo</span></div>
                 </div>

                 <div className="text-center md:text-left text-sm max-w-md">
                    <div className="font-bold text-lg">{user?.name}</div>
                    <div className="whitespace-pre-line text-gray-500 dark:text-gray-300">
                        {user?.bio || "Sem biografia."}
                    </div>
                    {user?.website && (
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold block mt-1 hover:underline">
                            {user.website.replace(/^https?:\/\//, '')}
                        </a>
                    )}
                 </div>
             </div>
          </div>

          {/* Tabs */}
          <div className={`border-t flex justify-center gap-4 md:gap-12 text-xs font-bold tracking-widest uppercase ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${activeTab === 'posts' ? (isDark ? 'border-white text-white' : 'border-black text-black') : 'border-transparent text-gray-500'}`}
            >
              <Grid size={12} /> Publicações
            </button>
            <button 
              onClick={() => setActiveTab('wardrobe')}
              className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${activeTab === 'wardrobe' ? (isDark ? 'border-white text-white' : 'border-black text-black') : 'border-transparent text-gray-500'}`}
            >
              <Shirt size={12} /> Guarda-Roupa
            </button>
            <button 
              onClick={() => setActiveTab('looks')}
              className={`flex items-center gap-2 py-4 border-t-2 transition-colors ${activeTab === 'looks' ? (isDark ? 'border-white text-white' : 'border-black text-black') : 'border-transparent text-gray-500'}`}
            >
              <Layers size={12} /> Combinações
            </button>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-1 md:gap-4 mt-1">
            {loading ? (
                 <div className="col-span-full py-12 flex justify-center"><div className={`animate-spin h-8 w-8 border-b-2 rounded-full ${isDark ? 'border-white' : 'border-black'}`}></div></div>
            ) : (
                <>
                    {items.map((item) => (
                    <div key={item.id} className={`aspect-square relative group cursor-pointer overflow-hidden rounded-sm md:rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                        {/* Logic to show image based on type */}
                        {item.image_urls && item.image_urls[0] ? (
                            <img src={item.image_urls[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : item.items && item.items[0] && item.items[0].image_urls ? (
                            <img src={item.items[0].image_urls[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Shirt /></div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold">
                           {activeTab === 'wardrobe' ? (
                               <span className="text-xs uppercase">{item.category}</span>
                           ) : (
                               <>
                                <div className="flex items-center gap-1"><span className="text-lg">❤️</span> {item.likes_count || 0}</div>
                               </>
                           )}
                        </div>
                    </div>
                    ))}
                </>
            )}
            
            {!loading && items.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center text-center">
                 <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-4 ${isDark ? 'border-gray-200' : 'border-gray-800'}`}>
                     {activeTab === 'wardrobe' ? <Shirt size={32} /> : <Grid size={32} />}
                 </div>
                 <h2 className="text-2xl font-bold mb-2">
                     Ainda sem itens
                 </h2>
                 <p className="text-gray-500">
                     Comece a adicionar peças ou criar looks.
                 </p>
              </div>
            )}
          </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className={`w-full max-w-md rounded-xl overflow-hidden max-h-[90vh] overflow-y-auto ${isDark ? 'bg-[#262626] text-white' : 'bg-white text-black'}`}>
                  <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h2 className="font-bold text-lg">Editar Perfil</h2>
                      <button onClick={() => setIsEditModalOpen(false)}><X size={24} /></button>
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                      {/* Banner Upload */}
                      <div className="w-full aspect-[16/5] rounded-lg overflow-hidden relative bg-gray-700 group">
                          {editForm.banner_url ? (
                              <img src={editForm.banner_url} className="w-full h-full object-cover" />
                          ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">Banner (16:9)</div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <ImageUpload 
                                onImageSelected={(base64) => setEditForm({...editForm, banner_url: base64})}
                                label="Alterar Banner"
                                className="text-white font-bold"
                             />
                          </div>
                      </div>

                      <div className="flex flex-col items-center gap-4 -mt-12 relative z-10">
                          <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${isDark ? 'bg-gray-800 border-[#262626]' : 'bg-gray-100 border-white'}`}>
                              {editForm.avatar_url ? (
                                  <img src={editForm.avatar_url} className="w-full h-full object-cover" />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Camera size={32} className="text-gray-400" /></div>
                              )}
                          </div>
                          <ImageUpload 
                             onImageSelected={(base64) => setEditForm({...editForm, avatar_url: base64})}
                             label="Alterar foto"
                             className="text-blue-500 text-sm font-semibold"
                          />
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Nome</label>
                              <input 
                                type="text" 
                                value={editForm.name} 
                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                className={`w-full p-2 rounded border outline-none ${isDark ? 'bg-black border-gray-700 text-white focus:border-white' : 'bg-gray-50 border-gray-300 text-black focus:border-black'}`}
                              />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Nome de usuário</label>
                              <input 
                                type="text" 
                                value={editForm.username} 
                                onChange={e => setEditForm({...editForm, username: e.target.value})}
                                className={`w-full p-2 rounded border outline-none ${isDark ? 'bg-black border-gray-700 text-white focus:border-white' : 'bg-gray-50 border-gray-300 text-black focus:border-black'}`}
                              />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Bio</label>
                              <textarea 
                                value={editForm.bio} 
                                onChange={e => setEditForm({...editForm, bio: e.target.value})}
                                className={`w-full p-2 rounded border outline-none h-20 resize-none ${isDark ? 'bg-black border-gray-700 text-white focus:border-white' : 'bg-gray-50 border-gray-300 text-black focus:border-black'}`}
                              />
                          </div>
                          <div>
                              <label className="text-xs text-gray-500 font-semibold uppercase block mb-1">Site</label>
                              <input 
                                type="text" 
                                value={editForm.website} 
                                onChange={e => setEditForm({...editForm, website: e.target.value})}
                                className={`w-full p-2 rounded border outline-none ${isDark ? 'bg-black border-gray-700 text-white focus:border-white' : 'bg-gray-50 border-gray-300 text-black focus:border-black'}`}
                              />
                          </div>
                      </div>

                      <button type="submit" className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition-colors">
                          Concluir
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
