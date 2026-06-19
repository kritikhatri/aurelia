import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../features/useAuthStore';
import { Sparkles, Check, Loader2, CalendarClock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [boxTier, setBoxTier] = useState('Signature');
  const [frequency, setFrequency] = useState('monthly');
  const [selectedPreferences, setSelectedPreferences] = useState(['Skincare focus']);

  // Fetch active subscription of user
  const { data: activeSub, isLoading } = useQuery({
    queryKey: ['mySub'],
    queryFn: async () => {
      if (!user) return null;
      const res = await api.get('/subscriptions');
      return res.data;
    },
    enabled: !!user
  });

  // Subscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/subscriptions', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Your Aurelia Membership Box is active!');
      queryClient.invalidateQueries(['mySub']);
      navigate('/dashboard?tab=subscription');
    },
    onError: () => {
      toast.error('Error initiating subscription');
    }
  });

  const handlePreferenceToggle = (pref) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter(p => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to subscribe to a box');
      navigate('/auth?tab=register');
      return;
    }

    subscribeMutation.mutate({
      boxTier,
      frequency,
      selectedPreferences
    });
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold" />
        <span className="font-serif italic text-xs text-plum/60">Checking membership registry...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-12 pb-16">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-gold" /> Aurelia Club
        </span>
        <h1 className="text-4xl font-serif text-plum dark:text-ivory mt-2">The Curated Beauty Box Membership</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-2 font-semibold">
          Fresh, hand-selected seasonal active formulas mailed to your doorstep
        </p>
      </div>

      {activeSub ? (
        <div className="glass-card p-8 border border-plum/10 text-center max-w-xl mx-auto space-y-4">
          <ShieldCheck className="w-12 h-12 text-gold mx-auto" />
          <h2 className="text-xl font-serif">Active Membership: <span className="font-bold text-gold">{activeSub.boxTier}</span></h2>
          <p className="text-xs text-plum/60 dark:text-ivory/60 leading-relaxed font-light">
            You are currently subscribed to the {activeSub.boxTier} box. Your next renewal date is: <span className="font-bold">{new Date(activeSub.nextRenewalDate).toLocaleDateString()}</span>.
          </p>
          <div className="pt-2">
            <Link to="/dashboard?tab=subscription" className="btn-plum text-xs">Manage Subscription</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubscribeSubmit} className="space-y-12">
          
          {/* Tiers Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'Essential',
                price: '29.99',
                desc: '3 sample-sized formulas to introduce you to active skincare.',
                features: ['3 Seasonal Formulas', 'Standard Delivery', '10% Shop Discount']
              },
              {
                id: 'Signature',
                price: '49.99',
                desc: '4 full-sized cosmeceuticals curated to match your specific concerns.',
                features: ['4 Full-sized Formulas', 'Priority Courier Delivery', '15% Shop Discount', 'Bestseller access']
              },
              {
                id: 'Prestige',
                price: '89.99',
                desc: 'Complete luxury selection of premium skincare, makeup, and perfume.',
                features: ['6 Premium Formulations', 'Immediate Courier Delivery', '20% Shop Discount', 'Private launches', 'Gold member benefits']
              }
            ].map((tier) => (
              <div
                key={tier.id}
                onClick={() => setBoxTier(tier.id)}
                className={`glass-card p-8 border cursor-pointer transition-all flex flex-col justify-between h-full relative ${
                  boxTier === tier.id
                    ? 'border-gold shadow-lg shadow-gold/5 bg-gold/5 scale-102'
                    : 'border-plum/10 hover:border-gold/30'
                }`}
              >
                {tier.id === 'Signature' && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-obsidian text-[8px] uppercase font-bold tracking-widest px-3 py-1">
                    Most Popular
                  </span>
                )}
                
                <div className="space-y-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-plum/50 dark:text-ivory/50">{tier.id} Box</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif font-bold text-plum dark:text-ivory">${tier.price}</span>
                    <span className="text-[10px] text-plum/50 dark:text-ivory/50 uppercase">/ Month</span>
                  </div>
                  <p className="text-xs font-light text-plum/70 dark:text-ivory/70 leading-relaxed">{tier.desc}</p>
                </div>

                <ul className="space-y-2 text-xs text-plum/80 dark:text-ivory/80 pt-6 border-t border-plum/5 mt-6">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-gold shrink-0" /> <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`w-full mt-8 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all rounded-none ${
                    boxTier === tier.id
                      ? 'bg-gold text-obsidian'
                      : 'border border-plum/20 hover:border-plum text-plum dark:border-ivory/20 dark:hover:border-ivory dark:text-ivory'
                  }`}
                >
                  Select Tier
                </button>
              </div>
            ))}
          </div>

          {/* Preferences and details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Frequency Selection */}
            <div className="glass-card p-6 border border-plum/10 space-y-4">
              <h3 className="font-serif font-semibold text-base flex items-center gap-2 border-b border-plum/5 pb-2">
                <CalendarClock className="w-4 h-4 text-gold" /> Delivery Frequency
              </h3>
              
              <div className="flex gap-4">
                {[
                  { id: 'monthly', label: 'Deliver Monthly' },
                  { id: 'quarterly', label: 'Deliver Quarterly' }
                ].map((freq) => (
                  <label key={freq.id} className="flex items-center gap-2 text-xs text-plum/80 dark:text-ivory/80 cursor-pointer flex-1 border border-plum/10 p-4 hover:border-gold">
                    <input
                      type="radio"
                      name="frequency"
                      checked={frequency === freq.id}
                      onChange={() => setFrequency(freq.id)}
                      className="accent-plum dark:accent-gold"
                    />
                    <span>{freq.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Choices / Preferences */}
            <div className="glass-card p-6 border border-plum/10 space-y-4">
              <h3 className="font-serif font-semibold text-base border-b border-plum/5 pb-2">Atelier Custom Choices</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-plum/70 dark:text-ivory/70">
                {[
                  'Skincare focus',
                  'Makeup focus',
                  'Fragrance focus',
                  'Sensitive formulas',
                  'Clean items',
                  'Anti-aging peptides'
                ].map((pref) => (
                  <label key={pref} className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={selectedPreferences.includes(pref)}
                      onChange={() => handlePreferenceToggle(pref)}
                      className="accent-plum dark:accent-gold"
                    />
                    <span>{pref}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Checkout subscribe trigger */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="btn-plum px-16 py-3.5 flex items-center gap-2"
            >
              {subscribeMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" /> Initiating Membership...
                </>
              ) : (
                <>
                  Subscribe to {boxTier} Box (${boxTier === 'Essential' ? '29.99' : boxTier === 'Signature' ? '49.99' : '89.99'}/mo)
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

export default SubscriptionPage;
