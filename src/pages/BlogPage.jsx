import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';

const BlogPage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
        <span className="font-serif italic text-xs text-plum/60">Opening editorial journal...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-16">
      
      {/* Title */}
      <div className="text-center py-6 border-b border-plum/5 dark:border-ivory/5">
        <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase flex items-center justify-center gap-1">
          <BookOpen className="w-4 h-4 text-gold" /> The Aurelia Journal
        </span>
        <h1 className="text-4xl font-serif text-plum dark:text-ivory mt-2">Dermatology Science & Botanical Arts</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-2 font-semibold">
          Investigating formulation architecture and skin behavior
        </p>
      </div>

      {/* Grid of posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts?.map((post) => (
          <article key={post._id} className="group relative overflow-hidden glass-card flex flex-col justify-between border border-plum/5 dark:border-ivory/5">
            <Link to={`/blog/${post.slug}`} className="block overflow-hidden aspect-[16/9] bg-plum/5">
              <img
                src={post.coverImage || 'https://via.placeholder.com/600x337'}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </Link>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex gap-2 flex-wrap">
                  {post.tags?.map(tag => (
                    <span key={tag} className="text-[9px] uppercase font-bold text-gold border border-gold/20 px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-serif font-bold text-plum dark:text-ivory hover:text-gold mt-3 group-hover:underline">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-xs text-plum/70 dark:text-ivory/70 mt-2 leading-relaxed font-light line-clamp-3">
                  {post.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-plum/5 pt-4 text-[10px] uppercase font-bold tracking-widest text-plum dark:text-ivory">
                <span>By {post.author}</span>
                <span className="flex items-center gap-1 text-gold group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};

export default BlogPage;
