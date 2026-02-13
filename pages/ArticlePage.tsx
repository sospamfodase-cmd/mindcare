import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import { Calendar, Tag, ArrowLeft, Download, Share2, Facebook, Linkedin, Twitter, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { decompressData } from '../src/utils/compression';

export const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      // Initial fetch (excludes heavy images/pdf)
      const fetchedPost = await blogService.getPostById(id);
      
      if (fetchedPost) {
        setPost(fetchedPost);
        setLoading(false);

        // Lazy load gallery images
        try {
          const images = await blogService.getPostImages(id);
          if (images && images.length > 0) {
            setPost(prev => prev ? { ...prev, images } : null);
          }
        } catch (err) {
          console.error('Error loading gallery images:', err);
        }
      } else {
        toast.error('Artigo não encontrado');
        navigate('/blog');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const title = post?.title || '';
    const text = `Li esse artigo sobre "${title}" da Dra. Bianca Amaral e achei interessante compartilhar!`;

    switch (platform) {
      case 'facebook':
        // Facebook sharer primarily relies on OG tags. 'quote' might be deprecated or ignored, 
        // but it's the only standard param for text.
        // If testing on localhost, FB cannot scrape the URL, so it may show nothing or an error.
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'twitter':
        // Twitter (X) intent supports 'text' and 'url'
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        // LinkedIn 'share-offsite' is strict. Using 'feed' URL allows pre-filling text.
        // Note: This requires the user to be logged in.
        window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        toast.success('Texto e link copiados para a área de transferência!');
        break;
    }
  };

  const handleDownloadPDF = async () => {
    if (!post?.id) return;
    
    // If we already have the PDF content (e.g. from a previous fetch or if it was small enough to include?), 
    // we could use it, but our new service pattern expects us to fetch it if it's missing.
    // However, the post object from getPostById now likely has pdf: null/undefined.
    
    try {
      setDownloadingPdf(true);
      const pdfData = await blogService.getPostPdf(post.id);
      
      if (!pdfData) {
        toast.error('PDF não disponível para este artigo.');
        return;
      }

      // Decompress if needed (handles legacy uncompressed data too)
      const pdfUrl = await decompressData(pdfData);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // If it was a blob URL, revoke it to save memory
      if (pdfUrl.startsWith('blob:')) {
        URL.revokeObjectURL(pdfUrl);
      }

      toast.success('Download iniciado!');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Erro ao baixar o PDF.');
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Voltar para o Blog
          </Link>

          <article className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100">
            {/* Header Image */}
            <div className="relative h-64 md:h-96 w-full">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-brand-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1 shadow-sm">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-400" />
                      <span>{post.date}</span>
                    </div>
                    <span>•</span>
                    <span>Por {post.author}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={downloadingPdf}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-xl hover:bg-brand-100 transition-colors font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Baixar PDF do Artigo"
                  >
                    {downloadingPdf ? (
                      <div className="w-4 h-4 border-2 border-brand-700/30 border-t-brand-700 rounded-full animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {downloadingPdf ? 'Baixando...' : 'PDF'}
                  </button>
                  <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1">
                    <button onClick={() => handleShare('facebook')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 hover:text-blue-600 transition-all"><Facebook className="w-4 h-4" /></button>
                    <button onClick={() => handleShare('twitter')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 hover:text-sky-500 transition-all"><Twitter className="w-4 h-4" /></button>
                    <button onClick={() => handleShare('linkedin')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 hover:text-blue-700 transition-all"><Linkedin className="w-4 h-4" /></button>
                    <button onClick={() => handleShare('copy')} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-600 hover:text-slate-900 transition-all"><LinkIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-slate prose-lg max-w-none mb-12">
                <p className="lead text-xl text-slate-600 font-medium mb-8 border-l-4 border-brand-300 pl-4 italic">
                  {post.excerpt}
                </p>
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>

              {/* Image Gallery */}
              {post.images && post.images.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">Galeria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {post.images.map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow">
                        <img src={img} alt={`Galeria ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </article>

        </div>
      </main>
      
      <Footer />
    </div>
  );
};
