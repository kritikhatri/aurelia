import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local filter states synced to searchParams
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [skinType, setSkinType] = useState(searchParams.get('skinType') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  // Sync state when params change (e.g. Nav Search)
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || '');
    setSkinType(searchParams.get('skinType') || '');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ['categoriesList'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return res.data;
    }
  });

  // Fetch Products based on all parameters
  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['productsList', page, keyword, category, skinType, sortBy, minPrice, maxPrice, rating],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        sortBy
      });
      if (keyword) params.append('keyword', keyword);
      if (category) params.append('category', category);
      if (skinType) params.append('skinType', skinType);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (rating) params.append('rating', rating);

      const res = await api.get(`/products?${params.toString()}`);
      return res.data;
    }
  });

  // Update query params
  const updateFilters = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    nextParams.set('page', '1'); // reset page
    setSearchParams(nextParams);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchParams({});
    setKeyword('');
    setCategory('');
    setSkinType('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setPage(1);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const nextParams = new URLSearchParams(searchParams);
    if (minPrice) nextParams.set('minPrice', minPrice);
    else nextParams.delete('minPrice');
    if (maxPrice) nextParams.set('maxPrice', maxPrice);
    else nextParams.delete('maxPrice');
    nextParams.set('page', '1');
    setSearchParams(nextParams);
    setPage(1);
  };

  return (
    <div className="space-y-8 pb-16 relative bg-gradient-to-br from-ivory/30 via-white to-ivory/20 dark:from-obsidian dark:via-black dark:to-obsidian-light/10">
      
      {/* Title */}
      <div className="text-center py-10 relative overflow-hidden bg-plum/5 dark:bg-black/20 border-b border-plum/10 dark:border-ivory/10">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-plum/5" />
        <h1 className="text-4xl sm:text-5xl font-serif text-plum dark:text-ivory relative z-10 font-bold tracking-wide">
          The Aurelia <span className="italic font-light">Apothecary</span>
        </h1>
        <p className="text-[10px] uppercase tracking-[0.25em] text-gold mt-3 font-bold relative z-10">
          Scientific Botanical Couture & Molecular Formulations
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters */}
        <aside className="space-y-6">
          <div className="flex items-center justify-between border-b border-plum/10 dark:border-ivory/10 pb-4">
            <h3 className="font-serif font-bold text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <button onClick={handleClearFilters} className="text-[10px] uppercase font-bold text-red-500 hover:underline">
              Clear All
            </button>
          </div>

          {/* Search bar inside filters */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold">Search</span>
            <div className="relative border-b border-plum/20 py-1">
              <input
                type="text"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  updateFilters('keyword', e.target.value);
                }}
                placeholder="BY INGREDIENT, KEYWORD"
                className="bg-transparent text-xs w-full outline-none uppercase placeholder-plum/45 dark:placeholder-ivory/45"
              />
              <Search className="w-4 h-4 absolute right-1 top-2 text-plum/40 dark:text-ivory/40" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-gold">Category</span>
            <div className="flex flex-col gap-3 mt-1">
              <label className="group flex items-center gap-3 text-xs text-plum/70 dark:text-ivory/70 cursor-pointer hover:text-gold transition-colors duration-200">
                <input
                  type="radio"
                  name="category"
                  checked={category === ''}
                  onChange={() => { setCategory(''); updateFilters('category', ''); }}
                  className="sr-only"
                />
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                  category === '' ? 'border-gold bg-gold/10' : 'border-plum/20 dark:border-ivory/20 group-hover:border-gold/50'
                }`}>
                  {category === '' && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                </div>
                <span>All Collections</span>
              </label>
              {categories?.map((cat) => (
                <label key={cat._id} className="group flex items-center gap-3 text-xs text-plum/70 dark:text-ivory/70 cursor-pointer hover:text-gold transition-colors duration-200">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat._id}
                    onChange={() => { setCategory(cat._id); updateFilters('category', cat._id); }}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    category === cat._id ? 'border-gold bg-gold/10' : 'border-plum/20 dark:border-ivory/20 group-hover:border-gold/50'
                  }`}>
                    {category === cat._id && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                  </div>
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Skin Type suitability */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-gold">Skin Type</span>
            <div className="flex flex-col gap-3 mt-1">
              {['', 'Dry', 'Oily', 'Combo', 'Sensitive', 'Normal'].map((type) => (
                <label key={type} className="group flex items-center gap-3 text-xs text-plum/70 dark:text-ivory/70 cursor-pointer hover:text-gold transition-colors duration-200">
                  <input
                    type="radio"
                    name="skinType"
                    checked={skinType === type}
                    onChange={() => { setSkinType(type); updateFilters('skinType', type); }}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    skinType === type ? 'border-gold bg-gold/10' : 'border-plum/20 dark:border-ivory/20 group-hover:border-gold/50'
                  }`}>
                    {skinType === type && <div className="w-1.5 h-1.5 rounded-full bg-gold" />}
                  </div>
                  <span>{type === '' ? 'All Types' : type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold">Price Filter</span>
            <form onSubmit={handlePriceApply} className="flex gap-2 items-center mt-2">
              <input
                type="number"
                placeholder="MIN"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-center outline-none"
              />
              <span className="text-plum/40 dark:text-ivory/40">-</span>
              <input
                type="number"
                placeholder="MAX"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-center outline-none"
              />
              <button type="submit" className="text-[10px] bg-plum text-ivory dark:bg-gold dark:text-obsidian px-2.5 py-1 uppercase font-bold">
                Go
              </button>
            </form>
          </div>

          {/* Rating filter */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gold">Ratings</span>
            <div className="flex flex-col gap-2 mt-2">
              {[4, 3, 2].map((stars) => (
                <button
                  key={stars}
                  onClick={() => { setRating(stars.toString()); updateFilters('rating', stars.toString()); }}
                  className={`text-left text-xs hover:text-gold flex items-center gap-1 focus:outline-none ${
                    rating === stars.toString() ? 'text-gold font-bold' : 'text-plum/70 dark:text-ivory/70'
                  }`}
                >
                  <span>{stars}+ Stars</span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Controls Bar */}
          <div className="flex justify-between items-center bg-plum/5 dark:bg-obsidian-light/30 px-4 py-3 border border-plum/5 dark:border-ivory/5">
            <span className="text-[10px] uppercase tracking-wider text-plum/60 dark:text-ivory/60 font-semibold">
              Showing {data?.products?.length || 0} of {data?.total || 0} formulas
            </span>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gold">Sort</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set('sortBy', e.target.value);
                  setSearchParams(nextParams);
                }}
                className="bg-transparent text-xs text-plum dark:text-ivory focus:outline-none border-b border-plum/20 font-semibold uppercase tracking-wider"
              >
                <option value="newest" className="bg-ivory dark:bg-obsidian">Newest</option>
                <option value="price_asc" className="bg-ivory dark:bg-obsidian">Price: Low-High</option>
                <option value="price_desc" className="bg-ivory dark:bg-obsidian">Price: High-Low</option>
                <option value="rating" className="bg-ivory dark:bg-obsidian">Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Active Chips */}
          {(category || skinType || keyword || minPrice || maxPrice || rating) && (
            <div className="flex flex-wrap gap-2">
              {keyword && (
                <span className="text-[10px] uppercase font-bold bg-plum/5 dark:bg-ivory/5 border border-plum/10 py-1 px-2.5 flex items-center gap-1.5">
                  Search: {keyword} <X className="w-3 h-3 cursor-pointer text-red-500" onClick={() => { setKeyword(''); updateFilters('keyword', ''); }} />
                </span>
              )}
              {skinType && (
                <span className="text-[10px] uppercase font-bold bg-plum/5 dark:bg-ivory/5 border border-plum/10 py-1 px-2.5 flex items-center gap-1.5">
                  Skin: {skinType} <X className="w-3 h-3 cursor-pointer text-red-500" onClick={() => { setSkinType(''); updateFilters('skinType', ''); }} />
                </span>
              )}
              {rating && (
                <span className="text-[10px] uppercase font-bold bg-plum/5 dark:bg-ivory/5 border border-plum/10 py-1 px-2.5 flex items-center gap-1.5">
                  Rating: {rating}+ <X className="w-3 h-3 cursor-pointer text-red-500" onClick={() => { setRating(''); updateFilters('rating', ''); }} />
                </span>
              )}
            </div>
          )}

          {/* Loading state vs Product grid */}
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : data?.products?.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <p className="font-serif italic text-lg text-plum/50 dark:text-ivory/50">No formulas match your selected filters.</p>
              <button onClick={handleClearFilters} className="btn-plum text-xs">Reset All Filters</button>
            </div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            >
              {data?.products?.map((prod) => (
                <motion.div
                  key={prod._id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
                  }}
                >
                  <ProductCard product={prod} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {data?.pages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-8 border-t border-plum/10 dark:border-ivory/10">
              <button
                disabled={page === 1}
                onClick={() => {
                  const nextP = page - 1;
                  setPage(nextP);
                  updateFilters('page', nextP.toString());
                }}
                className="px-4 py-2 border border-plum/20 dark:border-ivory/20 text-xs font-semibold uppercase disabled:opacity-30"
              >
                Previous
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-plum/60 dark:text-ivory/60">
                Page {page} of {data.pages}
              </span>
              <button
                disabled={page === data.pages}
                onClick={() => {
                  const nextP = page + 1;
                  setPage(nextP);
                  updateFilters('page', nextP.toString());
                }}
                className="px-4 py-2 border border-plum/20 dark:border-ivory/20 text-xs font-semibold uppercase disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Shop;
