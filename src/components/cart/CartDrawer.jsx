import React, { useState } from 'react';
import { X, Plus, Minus, Trash, Ticket, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../../features/useCartStore';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'sonner';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cartItems, updateQty, removeItem, coupon, applyCoupon, removeCoupon, getTotals } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const { subtotal, discount, total } = getTotals();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const res = await api.post('/orders/coupon', {
        code: couponCode,
        spendAmount: subtotal
      });
      applyCoupon(res.data);
      toast.success(`Coupon ${res.data.code} applied!`);
      setCouponCode('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleCheckoutRedirect = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Body */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-ivory dark:bg-obsidian border-l border-plum/10 dark:border-ivory/10 shadow-2xl flex flex-col h-full text-plum dark:text-ivory"
          >
            {/* Header */}
            <div className="h-16 px-6 border-b border-plum/5 dark:border-ivory/5 flex items-center justify-between">
              <span className="font-serif font-bold text-lg tracking-widest uppercase">My Atelier Cart</span>
              <button onClick={onClose} className="p-2 hover:bg-plum/5 rounded-full dark:hover:bg-ivory/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <span className="font-serif italic text-plum/50 dark:text-ivory/50">Your vanity case is empty.</span>
                  <button onClick={() => { onClose(); navigate('/shop'); }} className="btn-plum text-xs">
                    Begin Exploring
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={`${item.product}-${item.variant}`} className="flex gap-4 border-b border-plum/5 dark:border-ivory/5 pb-6">
                    <img
                      src={item.image || 'https://via.placeholder.com/150'}
                      alt={item.name}
                      className="w-20 h-24 object-cover border border-plum/5 dark:border-ivory/5"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif font-medium text-sm leading-tight">{item.name}</h4>
                          <span className="text-sm font-semibold">${item.price}</span>
                        </div>
                        {item.variant && (
                          <p className="text-[10px] uppercase font-bold text-gold mt-1">Shade/Size: {item.variant}</p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-plum/20 dark:border-ivory/20 px-1 py-0.5">
                          <button
                            onClick={() => updateQty(item.product, item.variant, item.qty - 1)}
                            className="p-1 hover:text-gold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.product, item.variant, item.qty + 1)}
                            className="p-1 hover:text-gold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product, item.variant)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider"
                        >
                          <Trash className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>

                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-plum/10 dark:border-ivory/10 bg-ivory-dark/10 dark:bg-obsidian-light/20 space-y-4">
                
                {/* Coupon Code Input */}
                {coupon ? (
                  <div className="flex justify-between items-center bg-gold/5 dark:bg-gold/10 p-3 border border-gold/20 text-xs">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-gold" />
                      <div>
                        <span className="font-bold text-gold">{coupon.code}</span>
                        <span className="text-[10px] text-plum/60 dark:text-ivory/60 ml-2">
                          (-{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`})
                        </span>
                      </div>
                    </div>
                    <button onClick={removeCoupon} className="text-red-500 hover:underline font-bold text-[10px] uppercase">
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ENTER PROMO CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-xs uppercase placeholder-plum/40 dark:placeholder-ivory/40"
                    />
                    <button
                      type="submit"
                      disabled={isApplying}
                      className="border border-plum text-plum dark:border-ivory dark:text-ivory px-4 py-1 text-xs uppercase font-semibold hover:bg-plum hover:text-ivory dark:hover:bg-ivory dark:hover:text-obsidian transition-all"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {/* Subtotals */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-plum/60 dark:text-ivory/60">Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Privilege Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-plum/5 dark:border-ivory/5 pt-2 text-sm font-bold">
                    <span>Estimated Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button onClick={handleCheckoutRedirect} className="w-full btn-plum flex items-center justify-center gap-2 group">
                  Proceed to Checkout <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
