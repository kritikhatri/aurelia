import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../features/useAuthStore';
import { MessageSquare, Heart, AlertTriangle, Send, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CommunityPage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [activeCategory, setActiveCategory] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('general');
  const [isPosting, setIsPosting] = useState(false);

  // Comment inputs indexed by post ID
  const [commentInputs, setCommentInputs] = useState({});

  // Fetch Community Posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['communityPosts', activeCategory],
    queryFn: async () => {
      const url = activeCategory ? `/community?category=${activeCategory}` : '/community';
      const res = await api.get(url);
      return res.data;
    }
  });

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/community', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Your discussion has been published!');
      setNewTitle('');
      setNewContent('');
      queryClient.invalidateQueries(['communityPosts', activeCategory]);
    },
    onError: () => {
      toast.error('Failed to publish post');
    }
  });

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/community/${id}/like`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityPosts', activeCategory]);
    }
  });

  // Comment Mutation
  const commentMutation = useMutation({
    mutationFn: async ({ id, content }) => {
      const res = await api.post(`/community/${id}/comment`, { content });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success('Reply posted!');
      setCommentInputs({ ...commentInputs, [variables.id]: '' });
      queryClient.invalidateQueries(['communityPosts', activeCategory]);
    }
  });

  // Flag Mutation
  const flagMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/community/${id}/flag`);
      return res.data;
    },
    onSuccess: () => {
      toast.warning('Post reported. Thank you for keeping the forum safe.');
      queryClient.invalidateQueries(['communityPosts', activeCategory]);
    }
  });

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to start a discussion');
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please complete all form fields');
      return;
    }

    createPostMutation.mutate({
      title: newTitle,
      content: newContent,
      category: newCategory
    });
  };

  const handleAddComment = (postId) => {
    const text = commentInputs[postId];
    if (!user) {
      toast.error('Please login to post a reply');
      return;
    }
    if (!text || !text.trim()) return;

    commentMutation.mutate({ id: postId, content: text });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="text-center py-6 border-b border-plum/5 dark:border-ivory/5">
        <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase flex items-center justify-center gap-1">
          <MessageSquare className="w-4 h-4 text-gold" /> The Aurelia Salon
        </span>
        <h1 className="text-4xl font-serif text-plum dark:text-ivory mt-2">Member Discussions & Skin Logs</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-2 font-semibold">
          Ask questions, share routine experiences, and connect with skin experts
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 text-xs uppercase font-bold tracking-wider">
        {[
          { id: '', label: 'All Conversations' },
          { id: 'skincare', label: 'Skincare Atelier' },
          { id: 'makeup', label: 'Editorial Makeup' },
          { id: 'haircare', label: 'Botanical Hair' },
          { id: 'general', label: 'General Lounge' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`border px-4 py-2 transition-all ${
              activeCategory === cat.id
                ? 'border-plum bg-plum text-ivory dark:border-gold dark:bg-gold dark:text-obsidian'
                : 'border-plum/10 text-plum/60 hover:border-plum dark:border-ivory/10 dark:text-ivory/60'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column - Form & Guidelines */}
        <div className="space-y-6">
          <div className="glass-card p-6 border border-plum/10">
            <h3 className="font-serif font-semibold text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" /> Start a Discussion
            </h3>

            {user ? (
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Choose Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-plum dark:text-ivory"
                  >
                    <option value="general" className="bg-ivory dark:bg-obsidian">General Lounge</option>
                    <option value="skincare" className="bg-ivory dark:bg-obsidian">Skincare Atelier</option>
                    <option value="makeup" className="bg-ivory dark:bg-obsidian">Editorial Makeup</option>
                    <option value="haircare" className="bg-ivory dark:bg-obsidian">Botanical Hair</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Topic Subject</label>
                  <input
                    type="text"
                    placeholder="WHAT WOULD YOU LIKE TO ASK?"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-plum dark:text-ivory uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Details / Questions</label>
                  <textarea
                    rows="5"
                    placeholder="DESCRIBE SKIN SYMPTOMS OR FORMULA REACTIONS"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                    className="w-full bg-transparent border border-plum/20 focus:border-gold p-3 text-xs text-plum dark:text-ivory"
                  />
                </div>

                <button type="submit" className="w-full btn-plum text-xs">
                  Publish Discussion
                </button>
              </form>
            ) : (
              <p className="text-xs font-light text-plum/50">
                Please <Link to="/auth?tab=login" className="underline font-bold text-gold">login</Link> to post to the salons.
              </p>
            )}
          </div>
        </div>

        {/* Right Columns - Posts list */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="py-12 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold" />
              <p className="text-xs text-plum/50 italic font-serif">Opening discussions...</p>
            </div>
          ) : !posts || posts.length === 0 ? (
            <p className="italic text-sm text-center py-12 text-plum/50">No discussions match this category yet. Be the first to post!</p>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="glass-card p-6 border border-plum/15 space-y-4">
                
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="text-xs">
                    <span className="text-[9px] uppercase font-bold text-gold border border-gold/20 px-2 py-0.5 rounded-none">{post.category}</span>
                    <h3 className="font-serif font-bold text-base mt-2">{post.title}</h3>
                    <p className="text-[10px] text-plum/50 dark:text-ivory/50 mt-1">Started by: {post.userName} | {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Flag action */}
                  <button
                    onClick={() => flagMutation.mutate(post._id)}
                    className="p-1.5 hover:bg-plum/5 rounded-full text-plum/40 hover:text-red-500 transition-all focus:outline-none"
                    title="Report Post"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>

                {/* Content body */}
                <p className="text-xs text-plum/80 dark:text-ivory/80 leading-relaxed font-light whitespace-pre-line">{post.content}</p>

                {/* Actions Likes / Replies */}
                <div className="flex items-center gap-6 border-t border-b border-plum/5 py-2.5 text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error('Please login to like');
                        return;
                      }
                      likeMutation.mutate(post._id);
                    }}
                    className={`flex items-center gap-1 hover:text-gold ${post.likes?.includes(user?._id) ? 'text-gold' : ''}`}
                  >
                    <Heart className="w-4 h-4" /> Like ({post.likes?.length || 0})
                  </button>
                  <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> Replies ({post.comments?.length || 0})</span>
                </div>

                {/* Comment replies feed */}
                {post.comments?.length > 0 && (
                  <div className="space-y-3 pl-4 border-l-2 border-gold/30 pt-2">
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-plum/50 dark:text-ivory/50 font-bold">
                          <span>{comment.userName}</span>
                          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-light text-plum/80 dark:text-ivory/80">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply box */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="WRITE A HELPFUL REPLY..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                    className="flex-1 bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none uppercase placeholder-plum/40 dark:placeholder-ivory/40"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="p-2 bg-plum text-ivory dark:bg-gold dark:text-obsidian hover:bg-gold hover:text-obsidian transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};

export default CommunityPage;
