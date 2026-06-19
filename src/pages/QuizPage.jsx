import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import useAuthStore from '../features/useAuthStore';
import ProductCard from '../components/product/ProductCard';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const QuizPage = () => {
  const { user, updateUserProfileState } = useAuthStore();
  const [step, setStep] = useState(1);
  
  // Answers states
  const [concern, setConcern] = useState('');
  const [afternoonFeel, setAfternoonFeel] = useState('');
  const [sensitivity, setSensitivity] = useState('');
  
  // Results states
  const [skinTypeResult, setSkinTypeResult] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleNextStep = (answer, setter) => {
    setter(answer);
    setStep(step + 1);
  };

  const handleCalculateResult = async () => {
    setIsCalculating(true);
    
    // Weighted scoring rules
    let type = 'Normal';
    if (afternoonFeel === 'tight') type = 'Dry';
    else if (afternoonFeel === 'shiny_all') type = 'Oily';
    else if (afternoonFeel === 'shiny_tzone') type = 'Combo';
    
    if (sensitivity === 'high') {
      type = 'Sensitive';
    }

    setSkinTypeResult(type);

    try {
      // If user is logged in, save skinType to their database profile
      if (user) {
        const concernsList = concern ? [concern] : [];
        const res = await api.put('/auth/profile', {
          skinType: type,
          skinConcerns: concernsList
        });
        updateUserProfileState(res.data);
      }

      // Fetch recommended products matching skinType
      const recsRes = await api.get(`/products/recommendations?skinType=${type}`);
      setRecommendedProducts(recsRes.data);
      setStep(4);
    } catch (err) {
      toast.error('Failed to save quiz results');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setConcern('');
    setAfternoonFeel('');
    setSensitivity('');
    setSkinTypeResult('');
    setRecommendedProducts([]);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-12 pb-16">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase flex items-center justify-center gap-1">
          <Sparkles className="w-4 h-4 text-gold" /> AI Skin Finder
        </span>
        <h1 className="text-4xl font-serif text-plum dark:text-ivory mt-2">Dermatology Skin Type Analyzer</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-2 font-semibold">
          Answer 3 brief questions to receive clean, scientifically-tailored formulas
        </p>
      </div>

      {/* Progress Bar */}
      {step < 4 && (
        <div className="w-full bg-plum/10 dark:bg-ivory/10 h-1">
          <div className="bg-gold h-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      )}

      {/* Quiz Card */}
      <div className="glass-card p-8 sm:p-12 border border-plum/10 shadow-xl min-h-[300px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CONCERN */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-serif text-plum dark:text-ivory">1. What is your primary skin concern?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'Dryness', label: 'Chronic Dryness & Flaking' },
                  { id: 'Aging', label: 'Fine Lines & Wrinkles' },
                  { id: 'Acne', label: 'Breakouts & Excess Oil' },
                  { id: 'Sensitivity', label: 'Redness & Irritated Spots' },
                  { id: 'Dullness', label: 'Uneven Tone & Lack of Luster' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleNextStep(option.id, setConcern)}
                    className="border border-plum/15 dark:border-ivory/15 p-4 text-xs font-semibold uppercase tracking-wider text-left hover:border-gold hover:bg-plum/5 dark:hover:bg-gold/5 transition-all text-plum dark:text-ivory"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: FEEL */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-serif text-plum dark:text-ivory">2. How does your skin feel in the afternoon?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'tight', label: 'Tight and flaky overall' },
                  { id: 'shiny_all', label: 'Shiny and greasy overall' },
                  { id: 'shiny_tzone', label: 'Shiny on forehead/nose, dry on cheeks' },
                  { id: 'normal', label: 'Comfortable, neither dry nor oily' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleNextStep(option.id, setAfternoonFeel)}
                    className="border border-plum/15 dark:border-ivory/15 p-4 text-xs font-semibold uppercase tracking-wider text-left hover:border-gold hover:bg-plum/5 dark:hover:bg-gold/5 transition-all text-plum dark:text-ivory"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SENSITIVITY */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-serif text-plum dark:text-ivory">3. Does your skin react easily to skincare actives or fragrance?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'high', label: 'Yes, easily turns red, itches, or breaks out' },
                  { id: 'mod', label: 'Occasionally, depending on active concentrations' },
                  { id: 'low', label: 'Rarely/never, skin is very resilient' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={async () => {
                      setSensitivity(option.id);
                      // Calculate results
                      afternoonFeel ? handleCalculateResult() : setStep(step + 1);
                    }}
                    className="border border-plum/15 dark:border-ivory/15 p-4 text-xs font-semibold uppercase tracking-wider text-left hover:border-gold hover:bg-plum/5 dark:hover:bg-gold/5 transition-all text-plum dark:text-ivory"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: RESULT */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-gold mx-auto" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-plum/50 dark:text-ivory/50">Analysis Complete</span>
                <h2 className="text-2xl font-serif">
                  Your Skin Profile is: <span className="font-bold text-gold">{skinTypeResult}</span>
                </h2>
                <p className="text-xs font-light text-plum/70 dark:text-ivory/70 max-w-lg mx-auto">
                  Based on your selections, we have curated a clinical, botanically-rich skincare sequence to target {concern?.toLowerCase()}.
                </p>
                <div className="pt-2">
                  <button onClick={handleReset} className="text-xs uppercase font-bold text-plum dark:text-ivory hover:text-gold flex items-center gap-1.5 mx-auto focus:outline-none">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
                  </button>
                </div>
              </div>

              {/* Recommended products list */}
              <div className="space-y-6 pt-6 border-t border-plum/10">
                <h3 className="font-serif font-bold text-lg text-left text-plum dark:text-ivory">Recommended Routine Sequence</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedProducts.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

    </div>
  );
};

export default QuizPage;
