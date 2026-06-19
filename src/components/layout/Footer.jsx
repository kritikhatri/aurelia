import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Instagram, Facebook, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      toast.success('Thank you for subscribing to Aurelia Journal');
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-plum/10 dark:border-ivory/10 bg-ivory-dark/20 dark:bg-obsidian-dark/50 pt-16 pb-24 md:pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Editorial Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" stroke-width="6"/>
              <circle cx="50" cy="50" r="20" fill="#3B1824"/>
            </svg>
            <span className="font-serif font-bold text-lg tracking-widest text-plum dark:text-ivory">AURELIA</span>
          </div>
          <p className="text-xs text-plum/70 dark:text-ivory/70 leading-relaxed font-light">
            Elevate Your Essence. Infinite Beauty, Scientifically Curated. High-performance botanical science meets couture aesthetic.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-plum/60 hover:text-gold dark:text-ivory/60 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-plum/60 hover:text-gold dark:text-ivory/60 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Directory Columns */}
        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-4">Discover</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-plum/70 dark:text-ivory/70">
            <li><Link to="/shop" className="hover:text-gold transition-colors">All Formulas</Link></li>
            <li><Link to="/quiz" className="hover:text-gold transition-colors">AI Skin Finder</Link></li>
            <li><Link to="/routine" className="hover:text-gold transition-colors">Routine Builders</Link></li>
            <li><Link to="/blog" className="hover:text-gold transition-colors">Editorial Journal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-4">Aurelia Care</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-plum/70 dark:text-ivory/70">
            <li><Link to="/dashboard" className="hover:text-gold transition-colors">My Profile</Link></li>
            <li><Link to="/dashboard?tab=orders" className="hover:text-gold transition-colors">Order Tracking</Link></li>
            <li><Link to="/dashboard?tab=subscription" className="hover:text-gold transition-colors">My Beauty Box</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition-colors">Get in Touch</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup with microinteraction */}
        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-4">The Journal</h4>
          <p className="text-xs text-plum/60 dark:text-ivory/60 mb-4 font-light">
            Subscribe to receive editorial scientific skin logs, private launches, and member promotions.
          </p>
          
          {subscribed ? (
            <div className="bg-plum/5 dark:bg-gold/5 p-4 border border-gold/10 text-xs text-plum dark:text-gold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold shrink-0" />
              <span>You are subscribed to the Aurelia Journal. Welcome.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-plum/20 focus-within:border-gold py-1">
              <input
                type="email"
                placeholder="YOUR EMAIL ADRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent text-xs w-full outline-none uppercase placeholder-plum/40 dark:placeholder-ivory/40 text-plum dark:text-ivory tracking-widest"
              />
              <button type="submit" className="text-plum dark:text-ivory hover:text-gold p-1 focus:outline-none">
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Copy & Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-plum/10 dark:border-ivory/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-plum/50 dark:text-ivory/50 uppercase tracking-widest">
        <span>© {new Date().getFullYear()} Aurelia Inc. All rights reserved.</span>
        <div className="flex gap-6">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> 100% Cruelty Free</span>
          <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Eco-Responsible Packages</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
