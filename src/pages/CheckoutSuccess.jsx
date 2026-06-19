import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../features/useAuthStore';
import { CheckCircle2, ShoppingBag, ArrowRight, Award, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const simulated = searchParams.get('simulated');
  const { user } = useAuthStore();

  // Fetch Order details if orderId is present
  const { data: order, isLoading } = useQuery({
    queryKey: ['orderConfirm', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      const res = await api.get(`/orders/${orderId}`);
      return res.data;
    },
    enabled: !!orderId
  });

  const handleShareReferral = () => {
    if (user?.referralCode) {
      const referralUrl = `${window.location.origin}/auth?ref=${user.referralCode}`;
      navigator.clipboard.writeText(referralUrl);
      toast.success('Referral link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-10">
      
      {/* Animated Success Check */}
      <div className="flex flex-col items-center gap-4">
        <CheckCircle2 className="w-16 h-16 text-gold animate-bounce" />
        <h1 className="text-3xl sm:text-4xl font-serif text-plum dark:text-ivory">Atelier Order Confirmed</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 font-bold">
          {simulated === 'true' ? 'Simulated Payment Authorized Successfully' : 'Stripe checkout complete'}
        </p>
      </div>

      {/* Order info details box */}
      <div className="glass-card p-8 border border-plum/10 text-left space-y-6">
        <div className="border-b border-plum/5 pb-4 flex justify-between items-center text-xs">
          <div>
            <span className="text-plum/50 dark:text-ivory/50">ORDER REFERENCE</span>
            <p className="font-bold font-serif text-sm uppercase mt-0.5">
              {orderId ? `#${orderId.substring(0, 12)}...` : '#AURELIA_ATELIER_CONFIRMED'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-plum/50 dark:text-ivory/50">STATUS</span>
            <p className="font-bold text-green-600 dark:text-green-400 mt-0.5 uppercase">PAID & PREPARING</p>
          </div>
        </div>

        {/* Pricing details & Points */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-gold" /> Member Reward Points
          </h3>
          <div className="bg-gold/5 border border-gold/10 p-4 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-gold">Points Credited to Your Account</span>
              <p className="text-[10px] text-plum/60 dark:text-ivory/60 mt-0.5">1 Point per $1 spent</p>
            </div>
            <span className="text-lg font-serif font-bold text-gold">
              +{order ? Math.floor(order.totalAmount) : 75} PTS
            </span>
          </div>
        </div>

        {/* Referral program CTA */}
        {user?.referralCode && (
          <div className="space-y-4 pt-4 border-t border-plum/5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gold">Share the Aurelia Experience</h3>
            <p className="text-xs font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
              Invite your friends to the Aurelia Atelier. They get **10% off** their first order, and you get **50 reward points** when they complete their first checkout!
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/auth?ref=${user.referralCode}`}
                className="bg-plum/5 dark:bg-ivory/5 text-[10px] border border-plum/10 p-2 flex-1 outline-none select-all text-plum dark:text-ivory"
              />
              <button onClick={handleShareReferral} className="btn-gold flex items-center gap-1.5 py-2 px-4 shrink-0">
                <Share2 className="w-3.5 h-3.5" /> Copy Link
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Button navigation */}
      <div className="flex justify-center gap-4 pt-4">
        <Link to="/dashboard" className="btn-plum px-8">Go to My Dashboard</Link>
        <Link to="/shop" className="btn-outline px-8 flex items-center gap-2">
          Continue Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default CheckoutSuccess;
