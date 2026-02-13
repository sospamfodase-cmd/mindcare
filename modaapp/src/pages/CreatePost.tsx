import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ImageUpload } from '../components/ImageUpload';
import { ArrowLeft, MapPin, Users, Hash, X } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const CreatePost = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const isDark = theme === 'dark';

  const handleAddTag = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && currentTag) {
          setHashtags([...hashtags, currentTag.replace('#', '')]);
          setCurrentTag('');
      }
  };

  const removeTag = (tag: string) => {
      setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
        alert("Escolha uma foto");
        return;
    }

    setLoading(true);
    try {
      const fullCaption = `${caption} ${hashtags.map(t => `#${t}`).join(' ')}`;
      await api.post('/posts', {
        caption: fullCaption,
        image_urls: [image],
        visibility: 'public'
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`max-w-2xl mx-auto min-h-screen transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <div className={`flex items-center justify-between p-4 border-b sticky top-0 z-10 backdrop-blur-md ${isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
        <button onClick={() => navigate(-1)} className={`p-2 -ml-2 rounded-full transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Novo Post</h1>
        <button 
            onClick={handleSubmit} 
            disabled={loading || !image}
            className="text-blue-500 font-semibold disabled:opacity-50 hover:text-blue-400 transition-colors"
        >
            {loading ? 'Postando...' : 'Compartilhar'}
        </button>
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-6">
        {/* Image Section */}
        <div className="w-full md:w-1/2 aspect-square bg-[#F5F5F5] rounded-lg overflow-hidden relative border border-gray-200 flex items-center justify-center">
             {image ? (
                 <>
                    <img src={image} className="w-full h-full object-cover" />
                    <button 
                        onClick={() => setImage('')}
                        className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                    >
                        <X size={20} />
                    </button>
                 </>
             ) : (
                 <div className="flex flex-col items-center justify-center h-full w-full">
                     <ImageUpload 
                        onImageSelected={setImage} 
                        label="Carregar Foto"
                        className="text-gray-500"
                     />
                 </div>
             )}
        </div>

        {/* Details Section */}
        <div className="flex-1 space-y-0">
             <div className="flex gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                     {/* User Avatar Placeholder */}
                 </div>
                 <textarea 
                    placeholder="Escreva uma legenda..."
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    className={`w-full h-32 resize-none outline-none text-base p-2 bg-transparent placeholder-gray-500 ${isDark ? 'text-white' : 'text-black'}`}
                 />
             </div>

             <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className={`divide-y ${isDark ? 'divide-gray-800' : 'divide-gray-200'}`}>
                    <button className="flex items-center gap-3 py-4 w-full text-left hover:opacity-70 transition-opacity">
                        <Users size={20} className={isDark ? 'text-white' : 'text-black'} />
                        <span className={`flex-1 font-medium ${isDark ? 'text-white' : 'text-black'}`}>Marcar Pessoas</span>
                    </button>
                    
                    <button className="flex items-center gap-3 py-4 w-full text-left hover:opacity-70 transition-opacity">
                        <MapPin size={20} className={isDark ? 'text-white' : 'text-black'} />
                        <span className={`flex-1 font-medium ${isDark ? 'text-white' : 'text-black'}`}>Adicionar Localização</span>
                    </button>

                    <div className="py-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Hash size={20} className={isDark ? 'text-white' : 'text-black'} />
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Hashtags</span>
                        </div>
                        <input 
                            type="text"
                            placeholder="Adicione tags (Enter para salvar)"
                            value={currentTag}
                            onChange={e => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            className={`w-full bg-transparent outline-none text-sm placeholder-gray-500 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                        />
                        <div className="flex flex-wrap gap-2 mt-3">
                            {hashtags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-800 text-white rounded-full text-sm flex items-center gap-1">
                                    #{tag}
                                    <button onClick={() => removeTag(tag)}><X size={14} /></button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};
