import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, ShieldCheck, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import { motion } from 'framer-motion';

const Home = () => {
  // Fetch Bestsellers / Featured Products
  const { data, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const res = await api.get('/products?sortBy=rating&page=1');
      return res.data.products?.slice(0, 3) || [];
    }
  });

  // Fetch Recent Blog Posts
  const { data: blogs } = useQuery({
    queryKey: ['recentBlogs'],
    queryFn: async () => {
      const res = await api.get('/blogs');
      return res.data?.slice(0, 2) || [];
    }
  });

  return (
    <div className="space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-start overflow-hidden bg-plum/10 dark:bg-black/40">
        {/* Decorative ambient background gradient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px] -mr-40 -mt-20 animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-plum/5 blur-[100px]" />
        
        {/* Editorial Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600"
            alt="Aurelia Beauty Editorial"
            className="w-full h-full object-cover opacity-35 dark:opacity-20"
          />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-xl ml-4 sm:ml-12 p-8 sm:p-12 glass-card border border-plum/10 dark:border-ivory/10 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-gold animate-bounce" />
            <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Scientific Botanical Couture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-plum dark:text-ivory leading-tight font-bold">
            Elevate Your <br />
            <span className="italic font-light">Moisture Barrier</span>
          </h1>
          <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
            Aurelia curates active copper peptides, cold-pressed plant squalane, and whipped ceramide lipids to restore your natural skin radiance.
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="btn-plum px-8">Discover Formulas</Link>
            <Link to="/quiz" className="btn-outline px-8 flex items-center gap-2">
              Skin Quiz <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Curated Catalog</span>
          <h2 className="text-3xl text-plum dark:text-ivory">Explore our Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Skincare Atelier',
              desc: 'Serums, active peptide oils, and rich barrier creams.',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
              link: '/shop?category=skincare'
            },
            {
              name: 'Fragrance Architecture',
              desc: 'Smoky oud wood, warm sandalwood, and night amber.',
              image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
              link: '/shop?category=fragrance'
            },
            {
              name: 'Editorial Cosmetics',
              desc: 'Satin foundations, pigments, and velvet lip jewel lipsticks.',
              image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
              link: '/shop?category=makeup'
            }
          ].map((cat, i) => (
            <Link to={cat.link} key={i} className="group block relative overflow-hidden aspect-[4/5] bg-plum/5">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent flex flex-col justify-end p-6 text-ivory">
                <h3 className="text-xl font-bold font-serif">{cat.name}</h3>
                <p className="text-xs font-light text-ivory/80 mt-1">{cat.desc}</p>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold mt-3 flex items-center gap-1">
                  Shop Category <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestselling Carousel */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Highly Rated</span>
            <h2 className="text-3xl text-plum dark:text-ivory">Bestselling Formulas</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase font-bold tracking-widest text-plum dark:text-ivory hover:text-gold flex items-center gap-1">
            Shop All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data?.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Editorial Teaser */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-plum/5 dark:bg-obsidian-light/30 p-8 sm:p-16 border border-plum/5 dark:border-ivory/5">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold" />
            <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Aurelia Editorial Journal</span>
          </div>
          <h2 className="text-3xl sm:text-4xl leading-tight text-plum dark:text-ivory">
            The Science of <br />
            <span className="italic font-light">Custom Layering</span>
          </h2>
          <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
            Dermatologists confirm that layering serums from lowest density to thickest lipid seals active hydration molecules. Learn how to map your routines with our virtual builder.
          </p>
          <div className="flex gap-4">
            <Link to="/routine" className="btn-plum px-8">Build My Routine</Link>
            <Link to="/blog" className="btn-outline px-8">Read Journal</Link>
          </div>
        </div>

        {/* Blog teasers */}
        <div className="space-y-6">
          {blogs?.map((post) => (
            <Link to={`/blog/${post.slug}`} key={post._id} className="block glass-card p-6 border hover:border-gold/30 transition-all">
              <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{post.tags?.[0]}</span>
              <h3 className="font-serif font-semibold text-base mt-2 hover:underline">{post.title}</h3>
              <p className="text-xs text-plum/60 dark:text-ivory/60 mt-1 line-clamp-2 font-light">{post.content}</p>
              <span className="text-[10px] uppercase font-bold tracking-widest text-plum dark:text-ivory mt-4 block">Read Article</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety & Care Credentials */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center pt-8 border-t border-plum/10 dark:border-ivory/10">
        <div className="flex flex-col items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <h3 className="font-serif font-bold text-sm">Certified Clean</h3>
          <p className="text-xs font-light text-plum/60 dark:text-ivory/60">Free of parabens, synthetic fillers, or endocrine disruptors.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Award className="w-8 h-8 text-gold" />
          <h3 className="font-serif font-bold text-sm">Cosmeceutical Actives</h3>
          <p className="text-xs font-light text-plum/60 dark:text-ivory/60">Every peptide blend is clinically tested to deliver visual elasticity.</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="w-8 h-8 text-gold" />
          <h3 className="font-serif font-bold text-sm">Tailored Rituals</h3>
          <p className="text-xs font-light text-plum/60 dark:text-ivory/60">Complete our skin finder quiz to unlock custom AM/PM formulas.</p>
        </div>
      </section>

    </div>
  );
};

export default Home;
