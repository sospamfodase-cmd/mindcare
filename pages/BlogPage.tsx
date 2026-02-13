import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import { Search, Tag, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
      setFilteredPosts(allPosts);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(allPosts.map(post => post.category)));
      setCategories(uniqueCategories);
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let result = posts;

    if (searchTerm) {
      result = result.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      result = result.filter(post => post.category === selectedCategory);
    }

    setFilteredPosts(result);
  }, [searchTerm, selectedCategory, posts]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Blog & Artigos</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore nossa coleção de artigos sobre saúde mental, bem-estar e neurociência.
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-12 flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar artigos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === null
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-brand-100/50 hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-brand-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-brand-700 text-xs font-bold rounded-full uppercase tracking-wide flex items-center gap-1 shadow-sm">
                        <Tag className="w-3 h-3" /> {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4 font-medium">
                      <Calendar className="w-4 h-4 text-brand-400" />
                      <span>{post.date}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors group/link mt-auto uppercase text-sm tracking-wide">
                      Ler artigo 
                      <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Nenhum artigo encontrado com os filtros selecionados.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                className="mt-4 text-brand-600 font-semibold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar para Home
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
