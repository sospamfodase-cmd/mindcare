import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';
import { emailService } from '../services/emailService';
import { BlogPost } from '../types';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, LogOut, Save, X, Image as ImageIcon, FileText, Upload, Users, Mail, Key, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { resizeImage } from '../src/utils/imageOptimizer';
import { compressData } from '../src/utils/compression';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [uploading, setUploading] = useState(false);
  const [notifySubscribers, setNotifySubscribers] = useState(true);
  
  // Newsletter States
  const [activeTab, setActiveTab] = useState<'posts' | 'newsletter'>('posts');
  const [subscribers, setSubscribers] = useState<{id: string, email: string, created_at: string}[]>([]);
  const [resendKey, setResendKey] = useState(() => import.meta.env.VITE_RESEND_API_KEY || localStorage.getItem('RESEND_API_KEY') || '');
  const [sending, setSending] = useState(false);

  // Load posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const allPosts = await blogService.getAllPosts();
        setPosts(allPosts || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        toast.error('Erro ao carregar artigos. Verifique sua conexão ou banco de dados.');
      }
    };
    fetchPosts();
  }, []);

  // Load subscribers when tab changes
  useEffect(() => {
    if (activeTab === 'newsletter') {
      const fetchSubscribers = async () => {
        try {
          const subs = await blogService.getAllSubscribers();
          setSubscribers(subs || []);
        } catch (err) {
          console.error('Error fetching subscribers:', err);
          toast.error('Erro ao carregar inscritos.');
        }
      };
      fetchSubscribers();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      excerpt: '',
      content: '',
      category: 'Saúde Mental',
      image: 'https://images.unsplash.com/photo-1511295742362-92c96b53b035?q=80&w=600&auto=format&fit=crop',
      images: [],
      pdf: undefined
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'images' | 'pdf') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    if (type === 'image') {
      if ((fileArray[0] as File).size > 10 * 1024 * 1024) {
        toast.error('A imagem original é muito grande (>10MB). Escolha uma menor.');
        return;
      }
    } else if (type === 'images') {
      const oversized = fileArray.filter((f: File) => f.size > 10 * 1024 * 1024);
      if (oversized.length > 0) {
        toast.error(`Algumas imagens são muito grandes (>10MB).`);
        return;
      }
    } else if (type === 'pdf') {
      if ((fileArray[0] as File).size > 50 * 1024 * 1024) {
        toast.error('O PDF é muito grande (>50MB). Mesmo comprimido, pode falhar.');
        return;
      }
    }

    setUploading(true);
    
    try {
      if (type === 'image') {
        const file = fileArray[0] as File;
        const optimized = await resizeImage(file, 800, 0.7);
        setCurrentPost(prev => ({ ...prev, image: optimized }));
        toast.success('Imagem de capa otimizada e anexada!');
      } else if (type === 'images') {
        const promises = fileArray.map((file: File) => resizeImage(file, 800, 0.7));
        const optimizedImages = await Promise.all(promises);
        setCurrentPost(prev => ({ ...prev, images: [...(prev.images || []), ...optimizedImages] }));
        toast.success(`${optimizedImages.length} imagens da galeria otimizadas e anexadas!`);
      } else if (type === 'pdf') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const rawData = e.target?.result as string;
            const compressed = await compressData(rawData);
            setCurrentPost(prev => ({ ...prev, pdf: compressed }));
            setUploading(false);
            toast.success('PDF comprimido e anexado com sucesso!');
          } catch (err) {
            console.error('Error compressing PDF:', err);
            toast.error('Erro ao comprimir PDF.');
            setUploading(false);
          }
        };
        reader.readAsDataURL(fileArray[0] as File);
        return;
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Erro ao processar arquivos.');
    } finally {
      if (type !== 'pdf') {
        setUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setCurrentPost(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = async (post: BlogPost) => {
    try {
      setLoading(true);
      // Carregar dados completos (incluindo imagens e PDF que são pesados)
      const [images, pdf] = await Promise.all([
        blogService.getPostImages(post.id),
        blogService.getPostPdf(post.id)
      ]);
      
      setCurrentPost({
        ...post,
        images: images || [],
        pdf: pdf || undefined
      });
      setIsEditing(true);
    } catch (error) {
      console.error('Erro ao carregar dados do post:', error);
      toast.error('Erro ao carregar dados completos do artigo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este artigo?')) {
      await blogService.deletePost(id);
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
      toast.success('Artigo excluído com sucesso!');
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPost.title || !currentPost.excerpt || !currentPost.content) {
      toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    if (uploading) {
      toast.error('Aguarde o upload dos arquivos terminar.');
      return;
    }

    setLoading(true);
    try {
      if (currentPost.id) {
        // Garantir que não estamos sobrescrevendo campos pesados com undefined se não foram carregados
        const updateData = { ...currentPost };
        await blogService.updatePost(currentPost.id, updateData);
        toast.success('Artigo atualizado com sucesso!');
      } else {
        const newPost = await blogService.createPost(currentPost as Omit<BlogPost, 'id' | 'date' | 'author'>);
        toast.success('Artigo criado com sucesso!');

        // Auto-send notification if enabled
        if (notifySubscribers && resendKey) {
          try {
            const subs = await blogService.getAllSubscribers();
            if (subs.length > 0) {
              const html = emailService.generateNewPostTemplate(newPost);
              const emails = subs.map(s => s.email);
              
              const result = await emailService.sendEmail({
                apiKey: resendKey,
                to: emails,
                subject: `Novo Artigo: ${newPost.title}`,
                html
              });
              
              if (result.warning) {
                  toast(result.warning, { icon: '⚠️', duration: 6000 });
              } else {
                  toast.success(`Notificação enviada para ${subs.length} inscritos!`, { duration: 5000 });
              }
            }
          } catch (err: any) {
            console.error('Failed to auto-send email:', err);
            
            if (err.message.includes('verify a domain')) {
                 toast.error('Erro: Domínio não verificado no Resend. Envio bloqueado para terceiros.', { duration: 6000 });
            } else {
                 toast.error('Post salvo, mas erro ao enviar e-mail: ' + err.message);
            }
          }
        } else if (notifySubscribers && !resendKey) {
            toast('Configure a API Key do Resend para enviar notificações automáticas.', { icon: '⚠️' });
        }
      }

      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
      setIsEditing(false);
      setCurrentPost({});
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar artigo. Tente novamente ou verifique o tamanho das imagens.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKey = () => {
    localStorage.setItem('RESEND_API_KEY', resendKey);
    toast.success('Chave API salva localmente!');
  };

  const handleSendNewsletter = async () => {
    if (!resendKey) return toast.error('Configure a Chave API do Resend primeiro.');
    if (subscribers.length === 0) return toast.error('Sem inscritos para enviar.');
    
    if(!window.confirm(`Tem certeza que deseja enviar a newsletter para ${subscribers.length} inscritos?`)) return;

    setSending(true);
    try {
        const latestPosts = await blogService.getAllPosts();
        const top3 = latestPosts.slice(0, 3);
        const html = emailService.generateNewsletterTemplate(top3);
        const emails = subscribers.map(s => s.email);
        
        const result = await emailService.sendEmail({
                  apiKey: resendKey,
                  to: emails,
                  subject: `Mindcare Weekly: ${top3[0]?.title || 'Novidades'}`,
                  html
              });
              
              if (result.warning) {
                toast(result.warning, { icon: '⚠️', duration: 6000 });
              } else {
                toast.success('Newsletter enviada com sucesso!');
              }
    } catch (e: any) {
        console.error(e);
        toast.error('Erro ao enviar: ' + e.message);
    } finally {
        setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-brand-600">Painel Administrativo</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600">Olá, {user?.username}</span>
            </div>
            
            {/* Tabs */}
            <div className="hidden md:flex ml-8 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'posts' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Artigos
              </button>
              <button
                onClick={() => setActiveTab('newsletter')}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'newsletter' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Newsletter
              </button>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-medium text-sm"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden px-4 py-2 bg-slate-50 border-t border-slate-200 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeTab === 'posts' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-500'}`}
          >
            Artigos
          </button>
          <button
            onClick={() => setActiveTab('newsletter')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-bold transition-all text-center ${activeTab === 'newsletter' ? 'bg-white text-brand-600 shadow-sm border border-slate-200' : 'text-slate-500'}`}
          >
            Newsletter
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'posts' && (
          !isEditing ? (
            /* List View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Gerenciar Artigos</h1>
                <button 
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-brand-600/20"
                >
                  <Plus className="w-5 h-5" /> Novo Artigo
                </button>
              </div>

              {/* Mobile View (Cards) */}
              <div className="md:hidden space-y-4">
                {posts.map((post) => (
                  <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-900 leading-tight">{post.title}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 whitespace-nowrap ml-2">
                        {post.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-sm text-slate-500 font-medium">{post.date}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="flex items-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" /> Editar
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className="flex items-center gap-1 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-sm font-bold"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" /> Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                    Nenhum artigo encontrado.
                  </div>
                )}
              </div>

              {/* Desktop View (Table) */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Imagem</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Título</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <img src={post.image} alt={post.title} className="w-10 h-10 rounded-lg object-cover" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{post.title}</div>
                          <div className="text-sm text-slate-500 truncate max-w-xs">{post.excerpt}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{post.date}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => handleEdit(post)}
                            className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {posts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          Nenhum artigo encontrado. Crie o primeiro!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Edit Form */
            <div className="max-w-3xl mx-auto">
               <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  {currentPost.id ? 'Editar Artigo' : 'Novo Artigo'}
                </h1>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="text-slate-500 hover:text-slate-700 p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Título do Artigo</label>
                  <input
                    type="text"
                    value={currentPost.title || ''}
                    onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    placeholder="Ex: A importância do sono..."
                    required
                  />
                </div>

                {/* Category & Image URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Categoria</label>
                    <select
                      value={currentPost.category || 'Saúde Mental'}
                      onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
                    >
                      <option>Saúde Mental</option>
                      <option>Bem-estar</option>
                      <option>Neurociência</option>
                      <option>Psiquiatria</option>
                      <option>Novidades</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Imagem de Capa (URL ou Upload)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={currentPost.image || ''}
                          onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                          placeholder="https://..."
                        />
                      </div>
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-4 rounded-xl transition-colors flex items-center justify-center border border-slate-200">
                        <Upload className="w-5 h-5 text-slate-600" />
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Galeria de Imagens</label>
                    <div className="flex flex-wrap gap-2">
                      {currentPost.images?.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20">
                          <img src={img} alt={`Galeria ${idx}`} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="cursor-pointer w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100">
                        <Plus className="w-6 h-6 text-slate-400" />
                        <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'images')} />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Anexar PDF</label>
                    <div className="flex items-center gap-2">
                      {currentPost.pdf ? (
                        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm font-medium border border-green-100">
                          <FileText className="w-4 h-4" />
                          PDF Anexado
                          <button type="button" onClick={() => setCurrentPost({ ...currentPost, pdf: undefined })} className="ml-2 text-green-800 hover:text-green-900 p-1 hover:bg-green-200 rounded-full transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors text-sm font-medium text-slate-700">
                          <Upload className="w-4 h-4" /> Escolher PDF
                          <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'pdf')} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resumo (Excerpt)</label>
                  <textarea
                    value={currentPost.excerpt || ''}
                    onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all h-24 resize-none"
                    placeholder="Breve descrição que aparecerá no card..."
                    required
                  />
                </div>

                {/* Full Content */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Conteúdo Completo</label>
                  <textarea
                    value={currentPost.content || ''}
                    onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all h-64 font-mono text-sm"
                    placeholder="Escreva o conteúdo do artigo aqui..."
                    required
                  />
                </div>

                {!currentPost.id && (
                  <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                        <input
                            type="checkbox"
                            id="notify"
                            checked={notifySubscribers}
                            onChange={(e) => setNotifySubscribers(e.target.checked)}
                            className="absolute w-0 h-0 opacity-0"
                        />
                        <label 
                            htmlFor="notify" 
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors ${notifySubscribers ? 'bg-brand-600' : 'bg-slate-300'}`}
                        >
                            <span className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${notifySubscribers ? 'translate-x-6' : 'translate-x-0'}`} />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="notify" className="font-bold text-slate-700 cursor-pointer select-none">
                            Notificar inscritos via e-mail
                        </label>
                        <p className="text-xs text-slate-500">
                            Envia um e-mail automático para todos os inscritos assim que o artigo for publicado.
                        </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-brand-600/40 transition-all flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Salvar Artigo
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          )
        )}

        {activeTab === 'newsletter' && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Gerenciar Newsletter</h1>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-4 bg-brand-50 text-brand-600 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total de Inscritos</p>
                  <p className="text-3xl font-extrabold text-slate-900">{subscribers.length}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Key className="w-5 h-5 text-brand-600" />
                            <h3 className="font-bold text-slate-900">Configuração de Envio (Resend API)</h3>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                            Insira sua chave API do Resend para enviar e-mails. Ela pode ser definida no arquivo .env (VITE_RESEND_API_KEY) ou salva aqui no navegador.
                            <a href="https://resend.com/api-keys" target="_blank" className="text-brand-600 hover:underline ml-1">Obter chave</a>
                        </p>
                        <div className="flex gap-2">
                            <input 
                                type="password" 
                                value={resendKey} 
                                onChange={(e) => setResendKey(e.target.value)}
                                placeholder="re_123456789..."
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                            <button onClick={handleSaveKey} className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-900">
                                Salvar
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                        <button 
                            onClick={handleSendNewsletter}
                            disabled={sending || !resendKey}
                            className="h-full px-6 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-brand-600/20 flex flex-col items-center justify-center gap-2 min-w-[140px] transition-all"
                        >
                            {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                            <span>{sending ? 'Enviando...' : 'Enviar Agora'}</span>
                        </button>
                        <p className="text-xs text-slate-400 text-center max-w-[140px]">
                            Envia os 3 últimos posts para todos os inscritos.
                        </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Subscribers List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Lista de E-mails</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{subscribers.length} contatos</span>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">E-mail</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50">Data de Inscrição</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {subscribers.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 text-slate-700 font-medium">{sub.email}</td>
                                    <td className="px-6 py-3 text-slate-500 text-sm">
                                        {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                                        Nenhum inscrito ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
