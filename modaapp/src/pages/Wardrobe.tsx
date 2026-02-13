import React, { useEffect, useState, useRef } from 'react';
import api from '../lib/api';
import { Plus, X, ChevronDown, Filter, Trash2, Maximize2, Check } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { useThemeStore } from '../store/themeStore';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  image_urls: string[];
}

const CATEGORIES = [
    { id: 'all', label: 'Tudo' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'shoes', label: 'Sapatos' },
    { id: 'accessories', label: 'Acessórios' },
];

export const Wardrobe = () => {
  const { theme } = useThemeStore();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  
  // New Item State
  const [newItem, setNewItem] = useState({ name: '', category: 'tops', image_url: '' });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/wardrobe');
      setItems(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.image_url) {
        alert("Por favor, adicione uma imagem.");
        return;
    }
    
    try {
      await api.post('/wardrobe', { ...newItem, image_urls: [newItem.image_url], is_public: true });
      
      // Local Backup
      try {
          const backup = JSON.parse(localStorage.getItem('wardrobe_backup') || '[]');
          backup.push({ ...newItem, image_urls: [newItem.image_url], date: new Date().toISOString() });
          localStorage.setItem('wardrobe_backup', JSON.stringify(backup));
      } catch (err) {
          console.warn("Local backup failed", err);
      }

      setIsModalOpen(false);
      fetchItems();
      setNewItem({ name: '', category: 'tops', image_url: '' });
      setSuccessMsg('Peça adicionada com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar peça. Tente novamente.");
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (!confirm('Tem certeza que deseja excluir esta peça?')) return;

      try {
          await api.delete(`/wardrobe/${id}`);
          setItems(items.filter(i => i.id !== id));
          
          // Update local backup
          try {
            const backup = JSON.parse(localStorage.getItem('wardrobe_backup') || '[]');
            const newBackup = backup.filter((i: any) => i.id !== id);
            localStorage.setItem('wardrobe_backup', JSON.stringify(newBackup));
          } catch (err) {
            console.warn("Failed to update backup", err);
          }

          setSuccessMsg('Peça excluída.');
          setTimeout(() => setSuccessMsg(''), 3000);
      } catch (error) {
          console.error("Error deleting item", error);
          alert("Erro ao excluir peça.");
      }
  };

  const filteredItems = activeCategory === 'all' 
      ? items 
      : items.filter(i => i.category === activeCategory);

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 border-b backdrop-blur-md transition-colors ${isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}>
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold font-serif">Guarda-Roupa</h1>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-500 transition-colors shadow-lg flex items-center gap-2"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Adicionar Peça</span>
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-3 px-4 scrollbar-hide">
              {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat.id 
                        ? (isDark ? 'bg-white text-black font-bold' : 'bg-black text-white font-bold')
                        : (isDark ? 'bg-transparent text-white border border-gray-600 hover:border-gray-400' : 'bg-transparent text-gray-600 border border-gray-300 hover:border-gray-400')
                    }`}
                  >
                      {cat.label}
                  </button>
              ))}
          </div>
      </div>

      {/* Success Message */}
      {successMsg && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <Check size={18} /> {successMsg}
          </div>
      )}

      {/* Grid */}
      <div className="p-1 md:p-4">
        {loading ? (
            <div className="flex justify-center py-20"><div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${isDark ? 'border-white' : 'border-black'}`}></div></div>
        ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className={`aspect-[3/4] relative group cursor-pointer overflow-hidden rounded-[4px] border transition-colors ${isDark ? 'bg-gray-900 border-gray-800 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                  {item.image_urls[0] ? (
                    <img src={item.image_urls[0]} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                          <button 
                            onClick={(e) => handleDeleteItem(e, item.id)}
                            className="bg-red-500/80 p-1.5 rounded-full text-white hover:bg-red-600 transition-colors"
                          >
                              <Trash2 size={16} />
                          </button>
                      </div>
                      <div>
                        <span className="text-white font-bold text-xs truncate block">{item.name}</span>
                        <span className="text-gray-400 text-[10px] uppercase">{item.category}</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
        )}
        
        {filteredItems.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
                <div className="w-20 h-20 border border-gray-700 rounded-full flex items-center justify-center mb-6 bg-[#121212]">
                    <Filter size={32} strokeWidth={1} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-400">Nenhuma peça encontrada.</p>
            </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`rounded-xl w-full max-w-sm overflow-hidden border ${isDark ? 'bg-[#262626] border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
                <h2 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-black'}`}>Nova Peça</h2>
                <button onClick={() => setIsModalOpen(false)} className={isDark ? 'text-white' : 'text-black'}><X size={24} /></button>
            </div>
            
            <form onSubmit={handleAddItem} className="p-4 space-y-4">
              <ImageUpload 
                onImageSelected={(base64) => setNewItem({...newItem, image_url: base64})}
                label="Foto da Peça"
                className={isDark ? 'text-white' : 'text-black'}
              />

              <input 
                type="text" 
                placeholder="Nome da peça"
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                className={`w-full border rounded-lg p-3 outline-none transition-colors ${
                    isDark 
                    ? 'bg-[#121212] border-gray-700 text-white focus:border-white' 
                    : 'bg-gray-50 border-gray-200 text-black focus:border-black'
                }`}
                required
              />
              
              <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <button
                          key={cat.id}
                          type="button"
                          onClick={() => setNewItem({...newItem, category: cat.id})}
                          className={`p-2 rounded-lg text-sm font-medium border transition-colors ${
                              newItem.category === cat.id 
                              ? (isDark ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                              : (isDark ? 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500' : 'bg-transparent text-gray-500 border-gray-200 hover:border-gray-400')
                          }`}
                      >
                          {cat.label}
                      </button>
                  ))}
              </div>

              <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">
                Salvar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
