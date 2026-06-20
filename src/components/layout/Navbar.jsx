import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, LogOut, LayoutDashboard, Compass, Settings, BookOpen, MessageSquare, Sparkles } from 'lucide-react';
import useAuthStore from '../../features/useAuthStore';
import useCartStore from '../../features/useCartStore';
import ThemeToggle from '../common/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onOpenCart }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cartItems } = useCartStore();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-nav h-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus:outline-none group">
            <svg className="w-7 h-7 transition-transform duration-500 group-hover:rotate-180" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" stroke-width="3"/>
              <circle cx="50" cy="50" r="14" fill="none" stroke="#3B1824" stroke-width="2" className="dark:stroke-gold"/>
              <line x1="50" y1="8" x2="50" y2="92" stroke="#D4AF37" stroke-width="2"/>
            </svg>
            <span className="font-serif font-bold text-lg tracking-[0.2em] text-plum dark:text-ivory group-hover:text-gold transition-colors duration-300">AURELIA</span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em] text-plum/80 dark:text-ivory/80">
            {[
              { label: 'Shop', path: '/shop' },
              { label: 'Skin Finder', path: '/quiz', icon: <Sparkles className="w-3.5 h-3.5 text-gold" /> },
              { label: 'Layering Lab', path: '/layering-simulator', badge: 'New' },
              { label: 'Routines', path: '/routine' },
              { label: 'Editorial', path: '/blog' },
              { label: 'Community', path: '/community' }
            ].map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path} 
                className="relative py-2 hover:text-gold transition-colors duration-300 flex items-center gap-1 group"
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-1 py-0.5 text-[8px] bg-gold text-obsidian rounded font-bold tracking-normal uppercase">
                    {link.badge}
                  </span>
                )}
                {/* Smooth Underline */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-3">
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-plum hover:bg-plum/5 dark:text-ivory dark:hover:bg-ivory/5 rounded-full transition-colors"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/dashboard?tab=wishlist"
              className="p-2 text-plum hover:bg-plum/5 dark:text-ivory dark:hover:bg-ivory/5 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {user?.wishlist?.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-plum text-ivory dark:bg-gold dark:text-obsidian rounded-full text-[10px] flex items-center justify-center font-bold">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <motion.button
              onClick={onOpenCart}
              className="p-2 text-plum hover:bg-plum/5 dark:text-ivory dark:hover:bg-ivory/5 rounded-full transition-colors relative focus:outline-none"
              aria-label="Cart"
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  class="absolute top-0 right-0 w-4.5 h-4.5 bg-plum text-ivory dark:bg-gold dark:text-obsidian rounded-full text-[10px] flex items-center justify-center font-bold shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="p-2 text-plum hover:bg-plum/5 dark:text-ivory dark:hover:bg-ivory/5 rounded-full transition-colors focus:outline-none"
                aria-label="Account Settings"
              >
                <User className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-52 glass-modal py-2 z-50 rounded-none shadow-xl border border-plum/10 text-xs text-plum dark:text-ivory"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-2 border-b border-plum/5 dark:border-ivory/5 font-semibold text-plum/60 dark:text-ivory/60">
                            Hi, {user.name}
                          </div>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="px-4 py-2.5 hover:bg-plum/5 dark:hover:bg-ivory/5 flex items-center gap-2"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Settings className="w-4 h-4 text-gold" /> Admin Panel
                            </Link>
                          )}
                          <Link
                            to="/dashboard"
                            className="px-4 py-2.5 hover:bg-plum/5 dark:hover:bg-ivory/5 flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" /> My Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2.5 hover:bg-plum/5 dark:hover:bg-ivory/5 flex items-center gap-2 text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/auth?tab=login"
                            className="px-4 py-2.5 hover:bg-plum/5 dark:hover:bg-ivory/5 flex items-center gap-2 font-medium"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/auth?tab=register"
                            className="px-4 py-2.5 hover:bg-plum/5 dark:hover:bg-ivory/5 flex items-center gap-2"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            Register
                          </Link>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Action Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-35 glass-nav border-t h-16 flex items-center justify-around px-4">
        <Link to="/" className="flex flex-col items-center gap-1 text-[10px] uppercase font-semibold text-plum/70 dark:text-ivory/70">
          <Compass className="w-5 h-5 text-plum dark:text-ivory" /> Home
        </Link>
        <Link to="/shop" className="flex flex-col items-center gap-1 text-[10px] uppercase font-semibold text-plum/70 dark:text-ivory/70">
          <ShoppingBag className="w-5 h-5 text-plum dark:text-ivory" /> Shop
        </Link>
        <Link to="/quiz" className="flex flex-col items-center gap-1 text-[10px] uppercase font-semibold text-plum/70 dark:text-ivory/70">
          <Sparkles className="w-5 h-5 text-gold animate-pulse" /> Quiz
        </Link>
        <Link to="/community" className="flex flex-col items-center gap-1 text-[10px] uppercase font-semibold text-plum/70 dark:text-ivory/70">
          <MessageSquare className="w-5 h-5 text-plum dark:text-ivory" /> Talk
        </Link>
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-[10px] uppercase font-semibold text-plum/70 dark:text-ivory/70">
          <User className="w-5 h-5 text-plum dark:text-ivory" /> Me
        </Link>
      </div>

      {/* Live Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          >
            <div className="fixed inset-0" onClick={() => setIsSearchOpen(false)} />
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              exit={{ y: -30 }}
              className="w-full max-w-2xl glass-modal p-6 shadow-2xl relative z-10 border border-plum/10"
            >
              <form onSubmit={handleSearchSubmit} className="flex gap-4">
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS, EDITORIAL STORIES, CLINICAL TAGS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-b border-plum/20 focus:border-gold py-2 outline-none uppercase font-serif tracking-widest text-plum dark:text-ivory placeholder-plum/40 dark:placeholder-ivory/40"
                  autoFocus
                />
                <button type="submit" className="btn-plum px-8">Search</button>
              </form>
              <p className="mt-4 text-[10px] uppercase tracking-wider text-plum/50 dark:text-ivory/50">
                Try searching: <span className="font-semibold text-plum dark:text-ivory">"Peptides"</span>, <span className="font-semibold text-plum dark:text-ivory">"Dry Skin"</span>, <span className="font-semibold text-plum dark:text-ivory">"Vespera"</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
