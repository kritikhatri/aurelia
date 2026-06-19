import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { BookOpen, Calendar, ArrowLeft, Loader2 } from 'lucide-react';

const BlogArticle = () => {
  const { slug } = useParams();

  // Fetch single article
  const { data: post, isLoading } = useQuery({
    queryKey: ['blogArticle', slug],
    queryFn: async () => {
      const res = await api.get(`/blogs/${slug}`);
      return res.data;
    }
  });

  // Fetch other posts
  const { data: related } = useQuery({
    queryKey: ['relatedBlogs', slug],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data?.filter(p => p.slug !== slug).slice(0, 2) || [];
    }
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
        <span className="font-serif italic text-xs text-plum/60">Retrieving article logs...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-24 text-center">
        <p className="font-serif text-lg text-plum/50">Article not found.</p>
        <Link to="/blog" className="btn-plum text-xs mt-4 inline-block">Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Back to list */}
      <Link to="/blog" className="text-xs uppercase font-bold tracking-widest text-plum dark:text-ivory hover:text-gold flex items-center gap-1.5 focus:outline-none">
        <ArrowLeft className="w-4 h-4" /> Back to Journal
      </Link>

      {/* Main article content */}
      <article className="space-y-6">
        
        {/* Cover */}
        <img
          src={post.coverImage || 'https://via.placeholder.com/800x450'}
          alt={post.title}
          className="w-full object-cover aspect-[16/9] border border-plum/10 shadow-lg"
        />

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 items-center text-xs text-plum/50 dark:text-ivory/50 border-b border-plum/5 pb-4">
          <span className="font-bold text-gold uppercase">{post.tags?.[0] || 'JOURNAL'}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> By {post.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(post.publishedAt || Date.now()).toLocaleDateString()}</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-serif text-plum dark:text-ivory leading-tight font-bold">
          {post.title}
        </h1>

        {/* Rich body text */}
        <div className="text-sm sm:text-base font-light leading-relaxed text-plum/80 dark:text-ivory/80 space-y-6">
          <p>{post.content}</p>
          <p>
            Cosmetic science has made rapid progress in peptide engineering. By altering amino acid chains, chemists can direct cellular signals to boost fibronectin and type-I collagen, offering deep structural anti-aging results. We recommend layering active peptide oils beneath moisture locking ceramide creams.
          </p>
          <p>
            This article is part of our commitment to ingredients transparency. Aurelia continues to collaborate with European cosmetic laboratories to verify botanical active performances. Keep watching our journals for next month's skin health logs.
          </p>
        </div>

      </article>

      {/* Related articles */}
      {related?.length > 0 && (
        <div className="border-t border-plum/10 dark:border-ivory/10 pt-10 space-y-6">
          <h3 className="font-serif font-semibold text-lg text-plum dark:text-ivory">Keep Reading</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post._id} className="block glass-card p-6 hover:border-gold/30 transition-all border border-plum/5">
                <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{post.tags?.[0]}</span>
                <h4 className="font-serif font-bold text-base mt-2 hover:underline text-plum dark:text-ivory">{post.title}</h4>
                <p className="text-xs text-plum/60 dark:text-ivory/60 mt-1 line-clamp-2 font-light">{post.content}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default BlogArticle;
