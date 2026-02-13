import React, { useEffect, useState, useRef } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Layers, Move, X, ChevronDown, Check, Trash2, Maximize2, RotateCw } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  image_urls: string[];
}

interface LookItem {
  id: string;
  wardrobe_item_id: string;
  image_url: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export const LookCreator = () => {
  const { theme } = useThemeStore();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [lookItems, setLookItems] = useState<LookItem[]>([]);
  const [activeTab, setActiveTab] = useState('tops');
  const [name, setName] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get('/wardrobe');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching wardrobe:', error);
    }
  };

  const addItemToCanvas = (item: WardrobeItem) => {
      const newItem: LookItem = {
          id: crypto.randomUUID(),
          wardrobe_item_id: item.id,
          image_url: item.image_urls[0],
          x: 50,
          y: 50,
          scale: 1,
          rotation: 0,
          zIndex: lookItems.length + 1
      };
      setLookItems([...lookItems, newItem]);
  };

  const removeItem = (id: string) => {
      setLookItems(lookItems.filter(i => i.id !== id));
      setSelectedItemId(null);
  };

  const updateItemPosition = (id: string, dx: number, dy: number) => {
     setLookItems(prev => prev.map(item => {
        if (item.id !== id) return item;
        return { ...item, x: item.x + dx, y: item.y + dy };
     }));
  };

  const handleTouchMove = (e: React.TouchEvent, id: string) => {
      // Basic touch drag implementation could go here
      // For MVP we stick to button controls or simple tap-to-move logic if complex drag is too heavy
  };
  
  const updateItemTransform = (id: string, key: 'scale' | 'rotation', delta: number) => {
      setLookItems(prev => prev.map(i => {
          if (i.id !== id) return i;
          return { ...i, [key]: i[key] + delta };
      }));
  };

  const handleSubmit = async () => {
    if (lookItems.length === 0) {
      alert('Adicione pelo menos uma peça');
      return;
    }
    if (!name) {
        alert('Dê um nome ao look');
        return;
    }

    setLoading(true);
    try {
      await api.post('/looks', {
        name,
        description: '',
        items: lookItems.map(i => i.wardrobe_item_id),
        is_public: true
      });
      navigate('/profile');
    } catch (error) {
      console.error('Error creating look:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex h-[calc(100vh-60px)] md:h-screen overflow-hidden flex-col md:flex-row transition-colors ${isDark ? 'bg-black text-white' : 'bg-gray-100 text-black'}`}>
      {/* Mobile Header */}
      <div className={`md:hidden p-4 border-b flex justify-between items-center z-20 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          <h1 className="font-bold text-lg">Criar Look</h1>
          <button onClick={handleSubmit} className="text-blue-500 font-bold">Salvar</button>
      </div>

      {/* Sidebar (Items) */}
      <div className={`
          w-full md:w-80 border-r flex flex-col transition-all duration-300 z-20
          ${isDark ? 'bg-[#121212] border-gray-800' : 'bg-white border-gray-200'}
          ${isSidebarOpen ? 'h-1/3 md:h-full' : 'h-12 md:h-full'}
      `}>
          <div className={`p-4 border-b flex flex-col gap-2 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <span className={`text-xl font-bold hidden md:block ${isDark ? 'text-white' : 'text-black'}`}>Peças</span>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide w-full pb-1">
                  {['tops', 'bottoms', 'shoes', 'accessories'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
                            activeTab === cat 
                            ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') 
                            : (isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                        }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                  <div className="flex justify-center py-10">
                      <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${isDark ? 'border-white' : 'border-black'}`}></div>
                  </div>
              ) : (
                  <div className="grid grid-cols-3 gap-2">
                      {items.filter(i => i.category === activeTab).map(item => (
                          <div 
                            key={item.id}
                            onClick={() => addItemToCanvas(item)}
                            className={`aspect-square rounded-lg overflow-hidden cursor-pointer border border-transparent hover:border-blue-500 transition-all group relative ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
                          >
                              <img src={item.image_urls[0]} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-xs text-white font-bold">+</span>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
              
              {!loading && items.filter(i => i.category === activeTab).length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-10">
                      Nenhuma peça encontrada nesta categoria.
                  </p>
              )}
          </div>
      </div>

      {/* Main Canvas Area */}
      <div className={`flex-1 relative overflow-hidden flex flex-col ${isDark ? 'bg-[#0B0B0B]' : 'bg-[#F0F0F0]'}`}>
          {/* Toolbar Desktop */}
          <div className="hidden md:flex absolute top-4 left-4 right-4 z-10 justify-between items-start pointer-events-none">
              <div className="pointer-events-auto">
                 <input 
                    type="text" 
                    placeholder="Nome do Look"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={`border rounded-lg py-2 px-4 outline-none w-64 ${isDark ? 'bg-[#1a1a1a] border-gray-700 text-gray-200 placeholder-gray-500 focus:border-gray-500' : 'bg-white border-gray-300 text-black placeholder-gray-400 focus:border-black'}`}
                 />
              </div>
              
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow-lg pointer-events-auto hover:bg-blue-500 transition-colors"
              >
                  {loading ? '...' : 'Salvar Look'}
              </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 relative touch-none" ref={canvasRef}>
              {lookItems.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                      <Layers size={64} className={`mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} strokeWidth={1} />
                      <p className={`text-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Seu canvas está vazio</p>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Toque nas peças ao lado para começar a criar</p>
                  </div>
              )}

              {lookItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`absolute transition-transform select-none ${selectedItemId === item.id ? 'z-50' : ''}`}
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        transform: `translate(-50%, -50%) scale(${item.scale}) rotate(${item.rotation}deg)`,
                        zIndex: item.zIndex,
                        width: '150px'
                    }}
                  >
                      <img 
                        src={item.image_url} 
                        className={`w-full h-auto drop-shadow-2xl pointer-events-none ${selectedItemId === item.id ? (isDark ? 'ring-2 ring-white/50 rounded-lg' : 'ring-2 ring-black/50 rounded-lg') : ''}`} 
                      />
                      
                      {selectedItemId === item.id && (
                          <div className={`absolute -top-14 left-1/2 -translate-x-1/2 backdrop-blur rounded-lg shadow-xl flex items-center gap-2 p-2 border ${isDark ? 'bg-black/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
                              <button onClick={(e) => { e.stopPropagation(); updateItemTransform(item.id, 'scale', -0.1) }} className={`p-1 rounded ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}>-</button>
                              <Maximize2 size={14} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                              <button onClick={(e) => { e.stopPropagation(); updateItemTransform(item.id, 'scale', 0.1) }} className={`p-1 rounded ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}>+</button>
                              
                              <div className={`w-px h-4 mx-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                              
                              <button onClick={(e) => { e.stopPropagation(); updateItemTransform(item.id, 'rotation', -15) }} className={`p-1 rounded ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}><RotateCw size={14} className="-scale-x-100" /></button>
                              <button onClick={(e) => { e.stopPropagation(); updateItemTransform(item.id, 'rotation', 15) }} className={`p-1 rounded ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}><RotateCw size={14} /></button>
                              
                              <div className={`w-px h-4 mx-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                              
                              <button onClick={(e) => { e.stopPropagation(); removeItem(item.id) }} className="p-1 hover:bg-red-500/20 text-red-500 rounded"><Trash2 size={14} /></button>
                          </div>
                      )}
                      
                      {/* D-pad controls for precise movement (Mobile friendly) */}
                      {selectedItemId === item.id && (
                          <div className={`absolute -bottom-24 left-1/2 -translate-x-1/2 backdrop-blur rounded-full p-2 grid grid-cols-3 gap-1 md:hidden pointer-events-auto z-50 ${isDark ? 'bg-black/80' : 'bg-white/80 shadow-lg border border-gray-200'}`}>
                              <div></div>
                              <button onClick={(e) => { e.stopPropagation(); updateItemPosition(item.id, 0, -5) }} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}>⬆️</button>
                              <div></div>
                              <button onClick={(e) => { e.stopPropagation(); updateItemPosition(item.id, -5, 0) }} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}>⬅️</button>
                              <div className={`flex items-center justify-center ${isDark ? 'text-white' : 'text-black'}`}><Move size={16} /></div>
                              <button onClick={(e) => { e.stopPropagation(); updateItemPosition(item.id, 5, 0) }} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}>➡️</button>
                              <div></div>
                              <button onClick={(e) => { e.stopPropagation(); updateItemPosition(item.id, 0, 5) }} className={`p-2 rounded-full ${isDark ? 'hover:bg-white/20 text-white' : 'hover:bg-black/10 text-black'}`}>⬇️</button>
                              <div></div>
                          </div>
                      )}
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};
