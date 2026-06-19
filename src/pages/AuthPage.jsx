import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../features/useAuthStore';
import api from '../services/api';
import { UserPlus, LogIn, Sparkles, Loader2, Home } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, setAuth } = useAuthStore();

  const tabParam = searchParams.get('tab') || 'login';
  const referralParam = searchParams.get('ref') || '';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(referralParam);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Sync tab with search parameters
  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (activeTab === 'register' && !name)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'login') {
        const res = await api.post('/auth/login', { email, password });
        setAuth(res.data, res.data.accessToken);
        toast.success(`Welcome back, ${res.data.name}!`);
        navigate('/dashboard');
      } else {
        const res = await api.post('/auth/register', {
          name,
          email,
          password,
          referralCode: referralCode || undefined
        });
        setAuth(res.data, res.data.accessToken);
        toast.success(`Account created successfully! Welcome to Aurelia.`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory dark:bg-obsidian-dark px-4 py-16 relative overflow-hidden transition-colors">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-plum/5 blur-[120px] -ml-20 -mt-20" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] -mr-20 -mb-20" />

      {/* Floating Home Link */}
      <Link to="/" className="absolute top-6 left-6 text-xs uppercase font-bold tracking-widest text-plum/60 dark:text-ivory/60 hover:text-gold flex items-center gap-1.5 focus:outline-none">
        <Home className="w-4 h-4" /> Home
      </Link>

      <div className="w-full max-w-md glass-card p-8 sm:p-10 border border-plum/10 shadow-2xl relative z-10 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <svg className="w-10 h-10 mx-auto" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" stroke-width="4"/>
            <circle cx="50" cy="50" r="24" fill="#3B1824"/>
          </svg>
          <h2 className="text-2xl font-serif text-plum dark:text-ivory uppercase tracking-widest mt-2">Aurelia Atelier</h2>
          <p className="text-[10px] uppercase tracking-wider text-plum/50 dark:text-ivory/50 font-bold">
            Science-Backed Botanicals & Luxury Makeup
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-plum/10 dark:border-ivory/10 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-3 text-center focus:outline-none ${
              activeTab === 'login' ? 'border-b-2 border-gold text-gold font-bold' : 'text-plum/40 dark:text-ivory/40'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 pb-3 text-center focus:outline-none ${
              activeTab === 'register' ? 'border-b-2 border-gold text-gold font-bold' : 'text-plum/40 dark:text-ivory/40'
            }`}
          >
            Register
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'register' && (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Full Name</label>
              <input
                type="text"
                placeholder="YOUR NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1.5 text-xs outline-none text-plum dark:text-ivory uppercase"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Email Address</label>
            <input
              type="email"
              placeholder="YOU@EMAIL.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1.5 text-xs outline-none text-plum dark:text-ivory uppercase"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1.5 text-xs outline-none text-plum dark:text-ivory"
            />
          </div>

          {activeTab === 'register' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">
                  Referral Code (Optional)
                </label>
                {referralParam && (
                  <span className="text-[9px] text-gold font-bold uppercase flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 text-gold" /> Link Active
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="AURELIA-XXXXXX"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1.5 text-xs outline-none text-plum dark:text-ivory uppercase"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-plum flex items-center justify-center gap-2 py-3 mt-4"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-gold" />
            ) : activeTab === 'login' ? (
              <>
                <LogIn className="w-4 h-4" /> Log In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create Atelier Account
              </>
            )}
          </button>
        </form>

        {/* Toggle message */}
        <div className="text-center text-[10px] uppercase tracking-wider text-plum/40 dark:text-ivory/40">
          {activeTab === 'login' ? (
            <span>
              New to Aurelia?{' '}
              <button onClick={() => navigate('/auth?tab=register')} className="font-bold text-gold hover:underline">
                Create Account
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button onClick={() => navigate('/auth?tab=login')} className="font-bold text-gold hover:underline">
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>

    </div>
  );
};

export default AuthPage;
