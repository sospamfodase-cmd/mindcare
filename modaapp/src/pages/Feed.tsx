import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface Post {
  id: string;
  caption: string;
  image_urls: string[];
  username: string;
  avatar_url?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

interface Suggestion {
    id: string;
    username: string;
    name: string;
    avatar_url?: string;
}

interface Comment {
    id: string;
    text: string;
    username: string;
    avatar_url?: string;
    created_at: string;
}

export const Feed = () => {
  const { theme } = useThemeStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Comments State
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    fetchPosts();
    fetchSuggestions();
  }, []);

  useEffect(() => {
      if (activePostId) {
          fetchComments(activePostId);
      }
  }, [activePostId]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
      try {
          const res = await api.get('/users/suggestions/list');
          setSuggestions(res.data);
      } catch (error) {
          console.error(error);
      }
  };

  const fetchComments = async (postId: string) => {
      setLoadingComments(true);
      try {
          const res = await api.get(`/social/posts/${postId}/comments`);
          setComments(res.data);
      } catch (error) {
          console.error("Error fetching comments", error);
      } finally {
          setLoadingComments(false);
      }
  };

  const handleLike = async (postId: string) => {
      // Optimistic update
      setPosts(current => current.map(p => {
          if (p.id === postId) return { ...p, likes_count: parseInt(p.likes_count as any) + 1 };
          return p;
      }));
      try {
          await api.post(`/social/posts/${postId}/like`);
      } catch (error) {
          console.error("Failed to like", error);
          // Revert if needed, but for now simplistic
      }
  };

  const handleAddComment = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !activePostId) return;

      try {
          const res = await api.post(`/social/posts/${activePostId}/comments`, { text: newComment });
          // Add to local list
          setComments([...comments, { ...res.data, username: 'Você', created_at: new Date().toISOString() }]); // Optimistic or use response
          setNewComment('');
          
          // Update post comment count
          setPosts(current => current.map(p => {
              if (p.id === activePostId) return { ...p, comments_count: parseInt(p.comments_count as any) + 1 };
              return p;
          }));
          
          // Refresh real comments to get correct user data if needed
          fetchComments(activePostId);
      } catch (error) {
          console.error("Failed to comment", error);
      }
  };

  const handleFollow = async (userId: string) => {
      try {
          await api.post(`/users/${userId}/follow`);
          setSuggestions(prev => prev.filter(s => s.id !== userId));
      } catch (error) {
          console.error(error);
      }
  };

  if (loading) return (
      <div className={`flex justify-center py-12 min-h-screen ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-black'}`}></div>
      </div>
  );

  return (
    <div className={`min-h-screen flex justify-center transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <div className="w-full max-w-[470px] space-y-4 pb-20 pt-4 md:pt-8">
        
        {posts.map((post) => (
          <div key={post.id} className={`border-b pb-4 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200 md:rounded-lg md:border'}`}>
            {/* Post Header */}
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[1.5px]">
                      <div className={`w-full h-full rounded-full border overflow-hidden ${isDark ? 'bg-black border-black' : 'bg-white border-white'}`}>
                          {post.avatar_url ? <img src={post.avatar_url} alt={post.username} className="w-full h-full object-cover" /> : <div className={`w-full h-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />}
                      </div>
                  </div>
                  <div className="flex flex-col">
                      <span className={`font-semibold text-sm cursor-pointer ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>{post.username}</span>
                      <span className="text-xs text-gray-500">Original Audio</span>
                  </div>
              </div>
              <button className={`${isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'}`}>
                  <MoreHorizontal size={20} />
              </button>
            </div>
            
            {/* Post Image */}
            <div className={`relative aspect-[4/5] overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-100'} border`}>
              <img 
                src={post.image_urls[0]} 
                alt={post.caption}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="px-3 pt-3">
              <div className="flex justify-between mb-3">
                  <div className="flex gap-4">
                      <button onClick={() => handleLike(post.id)} className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
                          <Heart size={24} />
                      </button>
                      <button onClick={() => setActivePostId(post.id)} className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
                          <MessageCircle size={24} className="-rotate-90" />
                      </button>
                      <button className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
                          <Send size={24} />
                      </button>
                  </div>
                  <button className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
                      <Bookmark size={24} />
                  </button>
              </div>

              <div className="font-semibold text-sm mb-2">{post.likes_count} curtidas</div>
              
              <div className="text-sm mb-1">
                <span className={`font-semibold mr-2 cursor-pointer ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>{post.username}</span>
                {post.caption}
              </div>

              <button onClick={() => setActivePostId(post.id)} className="text-gray-500 text-sm mt-1 mb-1">
                  Ver todos os {post.comments_count} comentários
              </button>
              
              <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                  {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mx-auto mb-4 ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
                <div className={`w-10 h-10 border-2 rounded-full ${isDark ? 'border-white' : 'border-black'}`}></div>
            </div>
            <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-black'}`}>Bem-vindo ao ModaSocial</h2>
            <p className="mb-4 text-sm">Siga pessoas para ver suas fotos e vídeos aqui.</p>
          </div>
        )}
      </div>

      {/* Right Sidebar (Desktop only) */}
      <div className="hidden lg:block w-[320px] pl-8 pt-8">
         <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
                 <div className={`w-11 h-11 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                     {/* User Avatar - Needs Auth Context if we want to show current user */}
                 </div>
                 <div className="flex flex-col">
                     <span className="font-semibold text-sm">Seu Perfil</span>
                     <span className="text-gray-500 text-sm">ModaSocial App</span>
                 </div>
             </div>
             <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">Mudar</button>
         </div>

         <div className="flex justify-between mb-4">
             <span className="text-sm font-semibold text-gray-500">Sugestões para você</span>
             <button className={`text-xs font-semibold hover:opacity-70 ${isDark ? 'text-white' : 'text-black'}`}>Ver tudo</button>
         </div>

         <div className="space-y-3">
             {suggestions.map(user => (
                 <div key={user.id} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className={`w-8 h-8 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                             {user.avatar_url && <img src={user.avatar_url} className="w-full h-full object-cover" />}
                         </div>
                         <div className="flex flex-col">
                             <span className="font-semibold text-xs">{user.username}</span>
                             <span className="text-gray-500 text-[10px]">Sugestão para você</span>
                         </div>
                     </div>
                     <button 
                        onClick={() => handleFollow(user.id)}
                        className="text-xs font-semibold text-blue-500 hover:text-blue-700"
                     >
                        Seguir
                     </button>
                 </div>
             ))}
             {suggestions.length === 0 && (
                 <p className="text-xs text-gray-500">Sem sugestões no momento.</p>
             )}
         </div>

         <div className="mt-8 text-xs text-gray-500 space-y-4">
             <p>Sobre • Ajuda • Imprensa • API • Carreiras • Privacidade • Termos • Localizações • Idioma • Meta Verified</p>
             <p>© 2026 MODASOCIAL FROM META</p>
         </div>
      </div>

      {/* Comments Modal */}
      {activePostId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setActivePostId(null)}>
              <div 
                className={`w-full max-w-lg h-[80vh] flex flex-col rounded-xl overflow-hidden shadow-2xl ${isDark ? 'bg-[#262626]' : 'bg-white'}`}
                onClick={e => e.stopPropagation()}
              >
                  {/* Header */}
                  <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Comentários</h3>
                      <button onClick={() => setActivePostId(null)} className={isDark ? 'text-white' : 'text-black'}>
                          <X size={24} />
                      </button>
                  </div>

                  {/* Comments List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {loadingComments ? (
                          <div className="flex justify-center py-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div></div>
                      ) : (
                          <>
                            {comments.length === 0 && (
                                <div className="text-center text-gray-500 py-10">
                                    Seja o primeiro a comentar.
                                </div>
                            )}
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-3">
                                    <div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                        {comment.avatar_url && <img src={comment.avatar_url} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex gap-2 items-baseline">
                                            <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-black'}`}>{comment.username}</span>
                                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{comment.text}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                          </>
                      )}
                  </div>

                  {/* Input */}
                  <form onSubmit={handleAddComment} className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Adicione um comentário..." 
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            className={`flex-1 rounded-full px-4 py-2 outline-none ${isDark ? 'bg-[#121212] text-white placeholder-gray-500' : 'bg-gray-100 text-black placeholder-gray-500'}`}
                          />
                          <button 
                            type="submit" 
                            disabled={!newComment.trim()}
                            className="text-blue-500 font-bold disabled:opacity-50"
                          >
                              Publicar
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};