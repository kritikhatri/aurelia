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
        // Toggle item locally in logic, backend will save
        wishlist: isWishlisted
          ? user.wishlist.filter((id) => id !== product._id)
          : [...user.wishlist, product._id]
      });
      // Update global auth profile
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

    // Default variant if available, otherwise empty
    const variantName = product.variants?.[0]?.name || '';
    addItem(product, variantName, 1);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="glass-card flex flex-col h-full relative group border border-plum/5 dark:border-ivory/5 transition-all overflow-hidden"
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
          className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-md hover:bg-white dark:bg-black/50 dark:hover:bg-black rounded-full transition-all focus:outline-none"
          aria-label="Wishlist Toggle"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isWishlisted ? 'fill-plum text-plum dark:fill-gold dark:text-gold' : 'text-plum/50 dark:text-ivory/50'
            }`}
          />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-350 flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-obsidian font-semibold text-[10px] uppercase tracking-widest hover:bg-gold hover:text-obsidian transition-colors active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Quick Add
          </button>
        </div>
      </Link>

      {/* Description Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">{product.brand}</span>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif font-semibold text-sm text-plum dark:text-ivory hover:text-gold mt-1 line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-plum/60 dark:text-ivory/60 mt-1 line-clamp-2 font-light">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-plum dark:text-ivory">${product.price}</span>
            {product.compareAtPrice && (
              <span className="text-xs line-through text-plum/40 dark:text-ivory/40 font-light">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-gold text-xs">
            <Star className="w-3.5 h-3.5 fill-gold text-gold" />
            <span className="font-semibold">{product.ratingsAvg || 5}</span>
            <span className="text-[10px] text-plum/40 dark:text-ivory/40">({product.ratingsCount})</span>
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default ProductCard;
