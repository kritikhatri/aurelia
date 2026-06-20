import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../../features/useCartStore';
import useAuthStore from '../../features/useAuthStore';
import api from '../../services/api';
import { toast } from 'sonner';

const ProductCard = ({ product, onWishlistUpdate }) => {
  const { addItem } = useCartStore();
  const { user, setUserProfileState } = useAuthStore();

  const isWishlisted = user?.wishlist?.includes(product._id);

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    try {
      const res = await api.put(`/auth/profile`, {
        wishlist: isWishlisted
          ? user.wishlist.filter((id) => id !== product._id)
          : [...user.wishlist, product._id]
      });
      useAuthStore.getState().updateUserProfileState(res.data);
      if (onWishlistUpdate) onWishlistUpdate();
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const variantName = product.variants?.[0]?.name || '';
    addItem(product, variantName, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-[#FAF9F6] dark:bg-[#121212] flex flex-col h-full relative group border border-plum/10 dark:border-ivory/10 hover:border-gold/50 dark:hover:border-gold/50 hover:shadow-[0_10px_30px_-10px_rgba(212,175,55,0.15)] transition-all duration-500 overflow-hidden"
    >
      {/* Product Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-plum/5">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x375'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className="absolute top-3 right-3 p-2 bg-[#FAF9F6]/80 backdrop-blur-md hover:bg-white dark:bg-black/50 dark:hover:bg-black rounded-full border border-plum/5 transition-all focus:outline-none"
          aria-label="Wishlist Toggle"
        >
          <Heart
            className={`w-3.5 h-3.5 transition-all ${
              isWishlisted ? 'fill-plum text-plum dark:fill-gold dark:text-gold' : 'text-plum/50 dark:text-ivory/50'
            }`}
          />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-obsidian/75 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FAF9F6] text-obsidian font-semibold text-[9px] uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-colors duration-300"
          >
            <ShoppingCart className="w-3 h-3" /> Quick Add
          </button>
        </div>
      </Link>

      {/* Description Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-gold">AURELIA</span>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif font-medium text-sm text-plum dark:text-ivory hover:text-gold mt-1.5 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-plum/60 dark:text-ivory/60 mt-1 line-clamp-2 font-light leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase text-plum/40 dark:text-ivory/40">usd</span>
            <span className="text-sm font-bold text-plum dark:text-ivory">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-xs line-through text-plum/40 dark:text-ivory/40 font-light">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-gold text-xs">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="font-semibold">{product.ratingsAvg || 5}</span>
            <span className="text-[9px] text-plum/40 dark:text-ivory/40">({product.ratingsCount})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
