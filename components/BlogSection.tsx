import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';

export const BlogSection: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Get latest 3 posts
    const fetchPosts = async () => {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts.slice(0, 3));
    };
    fetchPosts();
  }, []);

  return (
    <section id="blog" className="py-32 bg-slate-50 relative scroll-mt-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-brand-300"></div>
              <span className="text-brand-600 font-black tracking-[0.2em] uppercase text-xs">Conhecimento</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-serif text-slate-900 leading-tight">
              Artigos & <span className="italic">Perspectivas</span>
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              Exploramos temas essenciais da saúde mental através de uma visão técnica, humana e fundamentada em evidências.
            </p>
          </div>
          
          <Link to="/blog" className="group flex items-center gap-4 text-slate-900 font-bold uppercase text-xs tracking-[0.2em] whitespace-nowrap">
            Explorar todo o acervo
            <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-500">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full">
              <Link to={`/blog/${post.id}`} className="block relative aspect-[16/10] rounded-3xl overflow-hidden mb-8">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-2 shadow-xl border border-white/20">
                    <Tag className="w-3 h-3 text-brand-600" /> {post.category}
                  </span>
                </div>
              </Link>
              
              <div className="flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>{post.date}</span>
                </div>
                
                <h3 className="text-2xl font-serif text-slate-900 group-hover:text-brand-700 transition-colors duration-500 line-clamp-2 leading-tight">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                  {post.excerpt}
                </p>
                
                <div className="pt-4 mt-auto">
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-3 text-slate-900 font-bold uppercase text-[10px] tracking-[0.2em] group/link">
                    Ler artigo completo
                    <div className="w-2 h-2 rounded-full bg-brand-500 group-hover/link:w-6 transition-all duration-500"></div>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
