import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldAlert, CheckCircle, Info, Plus, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const LayeringSimulator = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [chemistryFeedback, setChemistryFeedback] = useState({ warnings: [], synergies: [], status: 'neutral' });

  // Fetch all skincare products from backend
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['skincareProducts'],
    queryFn: async () => {
      const res = await api.get('/products?category=skincare');
      return res.data.products || [];
    }
  });

  // Calculate chemistry feedback whenever layering changes
  useEffect(() => {
    validateLayering(selectedProducts);
  }, [selectedProducts]);

  const addProductToLayer = (product) => {
    if (selectedProducts.length >= 4) {
      toast.warning('Maximum layering depth of 4 formulas reached.');
      return;
    }
    if (selectedProducts.find((p) => p._id === product._id)) {
      toast.error('This formulation is already in your active layering sequence.');
      return;
    }
    setSelectedProducts([...selectedProducts, product]);
    toast.success(`${product.name.replace('Aurelia ', '')} added to beaker.`);
  };

  const removeProductFromLayer = (productId) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== productId));
  };

  const clearBeaker = () => {
    setSelectedProducts([]);
  };

  const validateLayering = (layers) => {
    const warnings = [];
    const synergies = [];
    let status = 'neutral';

    if (layers.length < 2) {
      setChemistryFeedback({ warnings: [], synergies: [], status: 'neutral' });
      return;
    }

    // Extract all ingredients from current layers
    const activeIngredients = layers.flatMap((p) => p.ingredients || []);
    
    // Conflict 1: Exfoliating Acids + Niacinamide
    const hasAcids = activeIngredients.some((i) => 
      ['Glycolic Acid', 'Lactic Acid', 'Salicylic Acid'].includes(i)
    );
    const hasNiacinamide = activeIngredients.some((i) => i.includes('Niacinamide'));
    
    if (hasAcids && hasNiacinamide) {
      warnings.push({
        title: 'Acid & Niacinamide Instability',
        text: 'Niacinamide is unstable at low pH levels. Layering exfoliating acids directly with Niacinamide can cause chemical conversion to niacin, resulting in facial flushing, warmth, and irritation. We recommend separating them: use Niacinamide in the AM and Acids in the PM.',
        severity: 'high'
      });
      status = 'warning';
    }

    // Conflict 2: Copper Peptides + Vitamin C (L-Ascorbic Acid)
    const hasPeptides = activeIngredients.some((i) => i.includes('Copper'));
    const hasVitC = activeIngredients.some((i) => i.includes('Vitamin C') || i.includes('L-Ascorbic'));

    if (hasPeptides && hasVitC) {
      warnings.push({
        title: 'Peptide & Vitamin C Oxidation',
        text: 'Copper peptides undergo structural oxidation when combined with pure L-Ascorbic Acid, rendering both active complexes chemically inactive. Layer them at different times (e.g. Vitamin C in your morning routine to fight free radicals, and Copper Peptides at night to trigger cell renewal).',
        severity: 'high'
      });
      status = 'warning';
    }

    // Synergy 1: Squalane + Hyaluronic Acid
    const hasSqualane = activeIngredients.some((i) => i.includes('Squalane'));
    const hasHA = activeIngredients.some((i) => i.includes('Hyaluronic'));

    if (hasSqualane && hasHA) {
      synergies.push({
        title: 'Active Seal Effect',
        text: 'Squalane creates a weightless lipid film that seals in the humectant moisture bound by multi-weight Hyaluronic Acid, preventing trans-epidermal water loss (TEWL).'
      });
      if (status !== 'warning') status = 'synergy';
    }

    // Synergy 2: Ceramides + Niacinamide
    const hasCeramides = activeIngredients.some((i) => i.includes('Ceramide'));
    if (hasCeramides && hasNiacinamide) {
      synergies.push({
        title: 'Stratum Corneum Repair Duo',
        text: 'Niacinamide stimulates natural ceramide biosynthesis, while the topical ceramides replenish lipids, working in symbiosis to restore skin barrier health.'
      });
      if (status !== 'warning') status = 'synergy';
    }

    setChemistryFeedback({ warnings, synergies, status });
  };

  const getContainerGlow = () => {
    switch (chemistryFeedback.status) {
      case 'warning':
        return 'shadow-[0_0_50px_-10px_rgba(239,68,68,0.25)] border-red-500/25';
      case 'synergy':
        return 'shadow-[0_0_50px_-10px_rgba(212,175,55,0.25)] border-gold/25';
      default:
        return 'shadow-2xl border-plum/10 dark:border-ivory/10';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Editorial Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-[10px] tracking-[0.25em] font-bold text-gold uppercase">Molecular Mixology Lab</span>
        <h1 className="text-4xl font-serif text-plum dark:text-ivory leading-tight">
          Skincare Layering & <span className="italic font-light">Chemistry Simulator</span>
        </h1>
        <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
          Not all actives play nice together. Select Aurelia formulations to simulate layering sequences, check molecular compatibility, and discover synergistic reactions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Shelf (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 border border-plum/5">
            <h2 className="text-lg font-serif text-plum dark:text-ivory mb-4">Aurelia Formulation Shelf</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 bg-plum/5 dark:bg-ivory/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
                {products.map((prod) => (
                  <div 
                    key={prod._id} 
                    className="flex items-center justify-between p-3 border border-plum/5 dark:border-ivory/5 hover:border-gold/30 dark:hover:border-gold/30 transition-all duration-300 bg-white/40 dark:bg-black/20"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={prod.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=80'} 
                        alt={prod.name} 
                        className="w-12 h-12 object-cover border border-plum/5"
                      />
                      <div>
                        <h3 className="text-xs font-semibold text-plum dark:text-ivory">{prod.name.replace('Aurelia ', '')}</h3>
                        <p className="text-[10px] font-light text-plum/50 dark:text-ivory/50 mt-0.5">
                          Actives: {prod.ingredients?.slice(0, 2).join(', ')}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addProductToLayer(prod)}
                      className="p-1.5 hover:bg-gold hover:text-obsidian transition-colors text-plum/70 dark:text-ivory/70 border border-plum/10 dark:border-ivory/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Simulator Beaker (Center) */}
        <div className="lg:col-span-4 space-y-6">
          <div className={`glass-card p-6 border transition-all duration-700 flex flex-col justify-between min-h-[500px] ${getContainerGlow()}`}>
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] tracking-wider uppercase font-bold text-plum/40 dark:text-ivory/40">Molecular Sequence</span>
                {selectedProducts.length > 0 && (
                  <button 
                    onClick={clearBeaker}
                    className="text-[10px] uppercase tracking-wider text-gold hover:text-plum dark:hover:text-ivory flex items-center gap-1 transition-colors"
                  >
                    Clear Lab
                  </button>
                )}
              </div>

              {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-plum/5 dark:bg-ivory/5 flex items-center justify-center border border-plum/10 dark:border-ivory/10 animate-pulse">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <p className="text-xs font-light text-plum/50 dark:text-ivory/50">
                    Add serums and creams from the shelf to formulate a routine and simulate chemistry checks.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {selectedProducts.map((prod, index) => (
                      <motion.div 
                        key={prod._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative flex items-center justify-between p-3 border border-plum/10 dark:border-ivory/10 bg-plum/5 dark:bg-ivory/5"
                      >
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold text-obsidian text-[8px] flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex items-center gap-3 pl-2">
                          <img 
                            src={prod.images?.[0]} 
                            alt={prod.name} 
                            className="w-10 h-10 object-cover"
                          />
                          <div>
                            <h3 className="text-xs font-bold text-plum dark:text-ivory">{prod.name.replace('Aurelia ', '')}</h3>
                            <p className="text-[9px] font-light text-plum/60 dark:text-ivory/60">
                              Layer: {index === 0 ? 'Base Active' : index === selectedProducts.length - 1 ? 'Lipid Seal' : 'Support Active'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeProductFromLayer(prod._id)}
                          className="text-plum/40 hover:text-red-500 dark:text-ivory/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Micro-Animation Beaker Fluid */}
            {selectedProducts.length > 0 && (
              <div className="mt-8 relative h-16 w-full bg-plum/5 dark:bg-ivory/5 overflow-hidden border border-plum/10 dark:border-ivory/10 rounded-lg">
                <motion.div 
                  initial={{ y: 64 }}
                  animate={{ y: 64 - (selectedProducts.length * 16) }}
                  transition={{ type: 'spring', stiffness: 50 }}
                  className={`absolute inset-0 opacity-40 transition-colors duration-700 ${
                    chemistryFeedback.status === 'warning' ? 'bg-red-500' :
                    chemistryFeedback.status === 'synergy' ? 'bg-gold' : 'bg-plum'
                  }`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-plum dark:text-ivory">
                    Mix Fluid Level: {selectedProducts.length * 25}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Diagnostics / Feedback (Right) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-card p-6 border border-plum/5 min-h-[500px]">
            <h2 className="text-lg font-serif text-plum dark:text-ivory mb-6">Lab Diagnostics</h2>

            {selectedProducts.length < 2 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
                <Info className="w-6 h-6 text-gold/60" />
                <p className="text-[11px] font-light text-plum/50 dark:text-ivory/50">
                  Select at least 2 formulations to trigger diagnostic analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full animate-ping ${
                    chemistryFeedback.status === 'warning' ? 'bg-red-500' :
                    chemistryFeedback.status === 'synergy' ? 'bg-gold' : 'bg-green-500'
                  }`} />
                  <span className="text-[10px] tracking-wider uppercase font-bold text-plum/60 dark:text-ivory/60">
                    Status: {chemistryFeedback.status.toUpperCase()}
                  </span>
                </div>

                {/* Warnings Section */}
                {chemistryFeedback.warnings.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-red-500 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3" /> Conflict Warnings
                    </span>
                    {chemistryFeedback.warnings.map((w, idx) => (
                      <div key={idx} className="p-3 bg-red-500/5 border border-red-500/10 space-y-1">
                        <h4 className="text-xs font-bold text-red-500 dark:text-red-400">{w.title}</h4>
                        <p className="text-[10px] font-light text-plum/70 dark:text-ivory/70 leading-relaxed">{w.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Synergies Section */}
                {chemistryFeedback.synergies.length > 0 && (
                  <div className="space-y-4">
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Synergy Bonuses
                    </span>
                    {chemistryFeedback.synergies.map((s, idx) => (
                      <div key={idx} className="p-3 bg-gold/5 border border-gold/10 space-y-1">
                        <h4 className="text-xs font-bold text-gold">{s.title}</h4>
                        <p className="text-[10px] font-light text-plum/70 dark:text-ivory/70 leading-relaxed">{s.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Neutral/Success status */}
                {chemistryFeedback.warnings.length === 0 && chemistryFeedback.synergies.length === 0 && (
                  <div className="p-4 border border-green-500/10 bg-green-500/5 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Formulation Stable</span>
                    <p className="text-[10px] font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
                      These formulas have no direct active conflicts and can be layered safely. Apply from thinnest density (water-based serums) to thickest (creams/oils).
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayeringSimulator;
