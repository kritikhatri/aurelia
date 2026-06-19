import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../features/useAuthStore';
import api from '../services/api';
import { User, ShoppingBag, Gift, Sparkles, Calendar, Heart, ShieldAlert, CalendarClock, CreditCard, Trash, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, updateUserProfileState } = useAuthStore();

  const activeTab = searchParams.get('tab') || 'profile';

  // State for profile form editing
  const [name, setName] = useState(user?.name || '');
  const [skinType, setSkinType] = useState(user?.skinType || '');
  const [skinConcerns, setSkinConcerns] = useState(user?.skinConcerns?.join(', ') || '');
  const [isUpdating, setIsUpdating] = useState(false);

  // Expiry tracker mock state (Makeup Collection Tracker)
  const [makeupCollection, setMakeupCollection] = useState([
    { id: '1', name: 'Aurelia Velvet Lip Jewel (Obsidian Red)', category: 'Lipstick', expiryDate: '2026-10-15', openedDate: '2025-10-15' },
    { id: '2', name: 'Satin Silk Breathable Foundation', category: 'Foundation', expiryDate: '2025-07-20', openedDate: '2024-07-20' }, // near expiry!
    { id: '3', name: 'Golden Hour Peptide Elixir', category: 'Serum', expiryDate: '2027-02-14', openedDate: '2026-02-14' }
  ]);

  const [newMakeup, setNewMakeup] = useState({ name: '', category: 'Lipstick', monthsValid: '12' });

  // Sync profile editing fields when user loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setSkinType(user.skinType || '');
      setSkinConcerns(user.skinConcerns?.join(', ') || '');
    }
  }, [user]);

  // Fetch Order history
  const { data: orders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get('/orders/myorders');
      return res.data;
    }
  });

  // Fetch Subscription box
  const { data: subscription, isLoading: isSubLoading } = useQuery({
    queryKey: ['mySub'],
    queryFn: async () => {
      const res = await api.get('/subscriptions');
      return res.data;
    }
  });

  // Fetch routines
  const { data: routines } = useQuery({
    queryKey: ['myRoutines'],
    queryFn: async () => {
      const res = await api.get('/routines');
      return res.data;
    }
  });

  // Profile Update handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const concernsArray = skinConcerns
        .split(',')
        .map(c => c.trim())
        .filter(c => c !== '');

      const res = await api.put('/auth/profile', {
        name,
        skinType,
        skinConcerns: concernsArray
      });

      updateUserProfileState(res.data);
      toast.success('Atelier profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile logs');
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel subscription mutation
  const cancelSubMutation = useMutation({
    mutationFn: async () => {
      const res = await api.put('/subscriptions/cancel');
      return res.data;
    },
    onSuccess: () => {
      toast.success('Subscription cancelled.');
      queryClient.invalidateQueries(['mySub']);
    }
  });

  // Makeup Tracker Operations
  const handleAddMakeup = (e) => {
    e.preventDefault();
    if (!newMakeup.name.trim()) return;

    const opened = new Date();
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + Number(newMakeup.monthsValid));

    const item = {
      id: Math.random().toString(36).substring(7),
      name: newMakeup.name,
      category: newMakeup.category,
      openedDate: opened.toISOString().split('T')[0],
      expiryDate: expiry.toISOString().split('T')[0]
    };

    setMakeupCollection([...makeupCollection, item]);
    setNewMakeup({ name: '', category: 'Lipstick', monthsValid: '12' });
    toast.success(`${item.name} added to your Makeup Collection tracker.`);
  };

  const handleRemoveMakeup = (id) => {
    setMakeupCollection(makeupCollection.filter(item => item.id !== id));
  };

  const checkExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', style: 'bg-red-500/10 text-red-600 border-red-200' };
    if (diffDays <= 90) return { label: `Near Expiry (${diffDays} days)`, style: 'bg-orange-500/10 text-orange-600 border-orange-200 animate-pulse' };
    return { label: 'Active / Fresh', style: 'bg-green-500/10 text-green-600 border-green-200' };
  };

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title */}
      <div className="border-b border-plum/5 dark:border-ivory/5 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-plum dark:text-ivory">My Atelier Space</h1>
          <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-1 font-semibold">
            Manage your profiles, routine diaries, and beauty calendars
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <nav className="flex flex-col gap-1 border-r border-plum/10 dark:border-ivory/10 pr-4">
          {[
            { id: 'profile', label: 'My Profile', icon: User },
            { id: 'orders', label: 'Order History', icon: ShoppingBag },
            { id: 'subscription', label: 'Beauty Subscription', icon: CreditCard },
            { id: 'rewards', label: 'Rewards & Referrals', icon: Gift },
            { id: 'routine', label: 'My Skin Diaries', icon: Calendar },
            { id: 'tracker', label: 'Cosmetics Expiry Tracker', icon: CalendarClock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-widest text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-plum text-ivory dark:bg-gold dark:text-obsidian'
                    : 'hover:bg-plum/5 dark:hover:bg-ivory/5 text-plum/70 dark:text-ivory/70'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Content Box */}
        <div className="lg:col-span-3">
          
          {/* PROFILE PANEL */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="font-serif font-semibold text-lg border-b border-plum/10 pb-2">Edit My Atelier Profile</h3>
              
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Registered Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-transparent border-b border-plum/10 py-1 text-xs outline-none text-plum/45 dark:text-ivory/45 uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Skin Type Profile</label>
                  <select
                    value={skinType}
                    onChange={(e) => setSkinType(e.target.value)}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-plum dark:text-ivory"
                  >
                    <option value="" className="bg-ivory dark:bg-obsidian">Not Specified</option>
                    <option value="Dry" className="bg-ivory dark:bg-obsidian">Dry Skin</option>
                    <option value="Oily" className="bg-ivory dark:bg-obsidian">Oily Skin</option>
                    <option value="Combo" className="bg-ivory dark:bg-obsidian">Combination Skin</option>
                    <option value="Sensitive" className="bg-ivory dark:bg-obsidian">Sensitive Skin</option>
                    <option value="Normal" className="bg-ivory dark:bg-obsidian">Normal Skin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Skin Concerns (comma separated)</label>
                  <input
                    type="text"
                    value={skinConcerns}
                    onChange={(e) => setSkinConcerns(e.target.value)}
                    placeholder="e.g. Acne, Dullness, Wrinkles"
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>

                <button type="submit" disabled={isUpdating} className="btn-plum text-xs px-8">
                  {isUpdating ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          )}

          {/* ORDERS HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-lg border-b border-plum/10 pb-2">My Purchase Logs</h3>
              
              {isOrdersLoading ? (
                <p className="italic text-xs text-plum/50">Fetching logs...</p>
              ) : !orders || orders.length === 0 ? (
                <p className="italic text-xs text-plum/50">You have no past purchases.</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o._id} className="glass-card p-6 border border-plum/10 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-2 text-xs">
                        <p className="font-serif font-bold text-sm uppercase">Order ID: #{o._id.substring(0, 12)}</p>
                        <p className="text-plum/50 dark:text-ivory/50">Placed on: {new Date(o.createdAt).toLocaleDateString()}</p>
                        <div className="text-[10px] uppercase font-bold text-gold">
                          Status: {o.orderStatus} | Payment: {o.paymentStatus}
                        </div>
                        <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-plum/70 dark:text-ivory/70">
                          {o.items.map((item, idx) => (
                            <li key={idx}>{item.name} x {item.qty} {item.variant && `(${item.variant})`}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-right sm:text-right space-y-1">
                        <span className="text-plum/50 dark:text-ivory/50 text-[10px] uppercase">Grand Total</span>
                        <p className="text-lg font-serif font-bold text-plum dark:text-ivory">${o.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BEAUTY BOX SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="font-serif font-semibold text-lg border-b border-plum/10 pb-2">My Beauty Box Subscription</h3>
              
              {isSubLoading ? (
                <p className="italic text-xs text-plum/50">Fetching membership...</p>
              ) : !subscription ? (
                <div className="space-y-4">
                  <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
                    You are not currently subscribed to our custom luxury box. Each month we mail a hand-selected set of fresh botanical formulas matching your skin quiz findings.
                  </p>
                  <button onClick={() => navigate('/subscription')} className="btn-plum text-xs">
                    Configure Custom Box
                  </button>
                </div>
              ) : (
                <div className="glass-card p-6 border border-plum/10 space-y-6">
                  <div className="flex justify-between border-b border-plum/5 pb-4 text-xs">
                    <div>
                      <span className="text-plum/50 dark:text-ivory/50 uppercase">Box Tier</span>
                      <p className="font-serif font-bold text-base mt-1 text-gold">{subscription.boxTier} Selection</p>
                    </div>
                    <div className="text-right">
                      <span className="text-plum/50 dark:text-ivory/50 uppercase">Membership Status</span>
                      <p className={`font-bold mt-1 uppercase ${subscription.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                        {subscription.status}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-plum/70 dark:text-ivory/70">
                    <p>Frequency: <span className="font-bold uppercase">{subscription.frequency} Delivery</span></p>
                    <p>Next Renewal Date: <span className="font-bold">{new Date(subscription.nextRenewalDate).toLocaleDateString()}</span></p>
                    <div className="pt-2">
                      <span className="text-[10px] uppercase font-bold text-plum/50">Preferences:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {subscription.selectedPreferences?.map(p => (
                          <span key={p} className="text-[9px] border border-plum/20 px-2 py-0.5 uppercase font-semibold">{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {subscription.status === 'active' && (
                    <button
                      onClick={() => cancelSubMutation.mutate()}
                      disabled={cancelSubMutation.isPending}
                      className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all rounded-none"
                    >
                      {cancelSubMutation.isPending ? 'Cancelling...' : 'Cancel Membership'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* REWARDS & REFERRALS */}
          {activeTab === 'rewards' && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-lg border-b border-plum/10 pb-2">Privilege Rewards & Referrals</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Rewards Balance */}
                <div className="glass-card p-6 border border-gold/20 bg-gold/5 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold flex items-center gap-1">
                      <Gift className="w-4 h-4" /> Active Points Balance
                    </span>
                    <p className="text-3xl font-serif font-bold text-plum dark:text-gold mt-2">{user?.rewardPoints || 0} PTS</p>
                  </div>
                  <p className="text-[11px] font-light text-plum/60 dark:text-ivory/60 leading-relaxed">
                    You earn 1 reward point for every $1 spent. You can redeem these points at checkout for discount vouchers or complementary luxury sample items.
                  </p>
                </div>

                {/* Referral Link sharing */}
                <div className="glass-card p-6 border border-plum/10 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gold flex items-center gap-1">
                      <Sparkles className="w-4 h-4" /> Share Aurelia Invite
                    </span>
                    <p className="text-xs font-light text-plum/70 dark:text-ivory/70 leading-relaxed mt-2">
                      Share your unique code with friends. They receive **10% off** their first purchase, and you earn **50 points**!
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-plum/50">My Invite Link:</span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/auth?ref=${user?.referralCode}`}
                        className="bg-plum/5 dark:bg-ivory/5 border border-plum/10 text-[9px] p-2 flex-1 outline-none select-all"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/auth?ref=${user?.referralCode}`);
                          toast.success('Invite link copied!');
                        }}
                        className="btn-gold py-1.5 px-3 text-[10px]"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ROUTINES (SKIN DIARIES) */}
          {activeTab === 'routine' && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-lg border-b border-plum/10 pb-2">My Daily Skincare Routines</h3>
              
              {!routines || routines.length === 0 ? (
                <div className="space-y-4">
                  <p className="text-sm font-light text-plum/70 dark:text-ivory/70">
                    You have not mapped any AM or PM skin routine diaries yet. Use our drag-and-drop builder to layer your catalog products.
                  </p>
                  <button onClick={() => navigate('/routine')} className="btn-plum text-xs">
                    Create Skincare Routine
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {routines.map((r) => (
                    <div key={r._id} className="glass-card p-6 border border-plum/10 space-y-4">
                      <div className="flex justify-between items-center border-b border-plum/5 pb-3">
                        <span className="font-serif font-bold text-sm text-gold">{r.routineType} Routine</span>
                        {r.reminderTime && (
                          <span className="text-[10px] text-plum/50 dark:text-ivory/50 flex items-center gap-1 font-bold">
                            <CalendarClock className="w-3.5 h-3.5" /> {r.reminderTime}
                          </span>
                        )}
                      </div>
                      <div className="space-y-2">
                        {r.steps.map((step) => (
                          <div key={step.stepNumber} className="flex gap-2 text-xs items-start">
                            <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold shrink-0">{step.stepNumber}</span>
                            <div>
                              <p className="font-semibold text-plum dark:text-ivory">
                                {step.product?.name || step.customProductName}
                              </p>
                              {step.note && <p className="text-[10px] text-plum/50 dark:text-ivory/50 italic mt-0.5">{step.note}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COSMETICS EXPIRY TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-6">
              <div className="border-b border-plum/10 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <h3 className="font-serif font-semibold text-lg">My Makeup Collection Tracker</h3>
                <span className="text-[9px] uppercase font-bold text-plum/50 dark:text-ivory/50 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-orange-500" /> Keep track of shelf life and get warnings
                </span>
              </div>

              {/* Add Cosmetic Form */}
              <form onSubmit={handleAddMakeup} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end bg-plum/5 dark:bg-obsidian-light/20 p-4 border border-plum/5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ENTER COSMETIC OR BRAND NAME"
                    value={newMakeup.name}
                    onChange={(e) => setNewMakeup({ ...newMakeup, name: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Shelf Life (Months)</label>
                  <select
                    value={newMakeup.monthsValid}
                    onChange={(e) => setNewMakeup({ ...newMakeup, monthsValid: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs text-plum dark:text-ivory"
                  >
                    <option value="6">6 Months</option>
                    <option value="12">12 Months (Standard)</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                  </select>
                </div>
                <button type="submit" className="btn-plum py-1.5 text-[10px] w-full flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Track Item
                </button>
              </form>

              {/* Collection List */}
              <div className="space-y-4">
                {makeupCollection.map((item) => {
                  const status = checkExpiryStatus(item.expiryDate);
                  return (
                    <div key={item.id} className="glass-card p-4 border border-plum/5 flex justify-between items-center gap-4">
                      <div className="text-xs space-y-1">
                        <h4 className="font-bold uppercase text-plum dark:text-ivory">{item.name}</h4>
                        <div className="flex gap-4 text-[10px] text-plum/50 dark:text-ivory/50">
                          <span>Opened: {item.openedDate}</span>
                          <span>Expiry: {item.expiryDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-[9px] uppercase font-bold border py-1 px-2.5 rounded-none ${status.style}`}>
                          {status.label}
                        </span>
                        <button
                          onClick={() => handleRemoveMakeup(item.id)}
                          className="p-1.5 hover:text-red-500 rounded-full hover:bg-plum/5"
                          aria-label="Remove item"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
