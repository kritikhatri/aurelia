import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Award, ShieldCheck, Info, Star, Wind, Flame, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import ProductCard from '../components/product/ProductCard';
import { SkeletonGrid } from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const topNotes = [
  { id: 'bergamot', name: 'Italian Bergamot', desc: 'Crisp, sparkling citrus that lifts the senses.', freshness: 9, warmth: 2, longevity: 3 },
  { id: 'cardamom', name: 'Spicy Cardamom', desc: 'Aromatic, warm, and sophisticated spice.', freshness: 4, warmth: 8, longevity: 5 },
  { id: 'neroli', name: 'Orange Neroli', desc: 'Light, honeyed orange blossom with clean facets.', freshness: 8, warmth: 3, longevity: 4 }
];

const heartNotes = [
  { id: 'rose', name: 'Damask Rose', desc: 'Velvet, opulent, romantic floral core.', freshness: 5, warmth: 6, longevity: 6 },
  { id: 'oud', name: 'Smoky Oud', desc: 'Deep, resinous, dark precious woods.', freshness: 1, warmth: 9, longevity: 8 },
  { id: 'jasmine', name: 'Egyptian Jasmine', desc: 'Intense, warm, narcotic night floral.', freshness: 6, warmth: 5, longevity: 7 }
];

const baseNotes = [
  { id: 'sandalwood', name: 'Creamy Sandalwood', desc: 'Soft, milky, calming balsamic wood.', freshness: 2, warmth: 9, longevity: 9 },
  { id: 'amber', name: 'Night Amber', desc: 'Warm, resinous, dark golden honey.', freshness: 1, warmth: 10, longevity: 10 },
  { id: 'musk', name: 'White Musk', desc: 'Clean, powdery, intimate skin warmth.', freshness: 5, warmth: 4, longevity: 8 }
];

const recommendations = [
  {
    id: 'bergamot-bloom',
    name: 'Aurelia Bergamot Bloom Eau de Toilette',
    slug: 'aurelia-bergamot-bloom-eau-de-toilette',
    image: '/images/fragrance.png',
    description: 'A light, cold-pressed Italian bergamot, lemon blossom, and neroli blend.'
  },
  {
    id: 'soleil-blanc',
    name: 'Aurelia Soleil Blanc Tiare Cologne',
    slug: 'aurelia-soleil-blanc-tiare-cologne',
    image: '/images/fragrance.png',
    description: 'A breezy cologne capturing sweet coconut water, tropical tiare flower petals, and sea salt.'
  },
  {
    id: 'sandalwood-parfum',
    name: 'Aurelia Aura Gold Sandalwood Parfum',
    slug: 'aurelia-aura-gold-sandalwood-parfum',
    image: '/images/fragrance.png',
    description: 'A warm, radiant blend of spicy bergamot, creamy sandalwood, and Madagascar vanilla.'
  },
  {
    id: 'bois-de-oud',
    name: 'Aurelia Bois de Oud Intense',
    slug: 'aurelia-bois-de-oud-intense',
    image: '/images/fragrance.png',
    description: 'Deep, smoky oud wood balanced with dark patchouli leaves and a subtle touch of rose petals.'
  },
  {
    id: 'vespera-night',
    name: 'Aurelia Vespera Night Eau de Parfum',
    slug: 'aurelia-vespera-night-eau-de-parfum',
    image: '/images/fragrance.png',
    description: 'An editorial perfume statement. A rich blend of midnight black amber, sensual jasmine, and dark plum.'
  }
];

const getRecommendedFragrance = (top, heart, base) => {
  let scores = {
    'bergamot-bloom': 0,
    'soleil-blanc': 0,
    'sandalwood-parfum': 0,
    'bois-de-oud': 0,
    'vespera-night': 0
  };

  if (top.id === 'bergamot') {
    scores['bergamot-bloom'] += 4;
    scores['sandalwood-parfum'] += 2;
  } else if (top.id === 'neroli') {
    scores['bergamot-bloom'] += 4;
    scores['soleil-blanc'] += 2;
  } else if (top.id === 'cardamom') {
    scores['sandalwood-parfum'] += 3;
    scores['bois-de-oud'] += 2;
    scores['vespera-night'] += 1;
  }

  if (heart.id === 'rose') {
    scores['bois-de-oud'] += 4;
    scores['vespera-night'] += 2;
  } else if (heart.id === 'oud') {
    scores['bois-de-oud'] += 5;
    scores['sandalwood-parfum'] += 2;
  } else if (heart.id === 'jasmine') {
    scores['vespera-night'] += 4;
    scores['soleil-blanc'] += 3;
  }

  if (base.id === 'sandalwood') {
    scores['sandalwood-parfum'] += 5;
    scores['bois-de-oud'] += 2;
  } else if (base.id === 'amber') {
    scores['vespera-night'] += 5;
    scores['bois-de-oud'] += 1;
  } else if (base.id === 'musk') {
    scores['soleil-blanc'] += 4;
    scores['bergamot-bloom'] += 2;
  }

  const fresh = (top.freshness + heart.freshness + base.freshness) / 3;
  const warm = (top.warmth + heart.warmth + base.warmth) / 3;
  const long = (top.longevity + heart.longevity + base.longevity) / 3;

  if (fresh > 7) scores['bergamot-bloom'] += 2;
  if (fresh > 5 && long > 6) scores['soleil-blanc'] += 2;
  if (warm > 8) {
    scores['vespera-night'] += 2;
    scores['bois-de-oud'] += 1;
  }
  if (warm > 7 && long > 8) scores['sandalwood-parfum'] += 2;

  let bestId = 'vespera-night';
  let maxScore = -1;
  Object.keys(scores).forEach((id) => {
    if (scores[id] > maxScore) {
      maxScore = scores[id];
      bestId = id;
    }
  });

  return recommendations.find((r) => r.id === bestId);
};

const getPoeticDescription = (top, heart, base) => {
  const descriptors = {
    'bergamot': 'sparkling rays of Italian bergamot',
    'cardamom': 'the aromatic warmth of ground cardamom',
    'neroli': 'the delicate, honeyed bloom of neroli flowers',
    'rose': 'a velvet, romantic sillage of Damask rose petals',
    'oud': 'the smoky resinous depth of precious oud wood',
    'jasmine': 'the opulent, nocturnal facets of Jasmine absolute',
    'sandalwood': 'a smooth, milky trail of vintage sandalwood',
    'amber': 'a rich, golden pool of dark night amber',
    'musk': 'a soft, powdery skin-like envelope of white musk'
  };

  return `An opening of ${descriptors[top.id]} cascades into a heart of ${descriptors[heart.id]}, resolving into a lingering sillage of ${descriptors[base.id]}.`;
};

const concentrationOptions = [
  { id: 'cologne', name: 'Cologne', desc: '10% Essence (Volatile)', freshMult: 1.25, warmMult: 0.7, longMult: 0.7 },
  { id: 'edt', name: 'Eau de Toilette', desc: '15% Essence (Balanced)', freshMult: 1.0, warmMult: 0.9, longMult: 0.9 },
  { id: 'edp', name: 'Eau de Parfum', desc: '20% Essence (Rich)', freshMult: 0.85, warmMult: 1.2, longMult: 1.2 },
  { id: 'extrait', name: 'Extrait de Parfum', desc: '30% Essence (Intense)', freshMult: 0.65, warmMult: 1.5, longMult: 1.5 }
];

const Home = () => {
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [activeIngredient, setActiveIngredient] = useState('peptides');

  const [selectedTop, setSelectedTop] = useState(topNotes[0]);
  const [selectedHeart, setSelectedHeart] = useState(heartNotes[0]);
  const [selectedBase, setSelectedBase] = useState(baseNotes[0]);
  const [concentration, setConcentration] = useState('edp');

  const activeConc = concentrationOptions.find(o => o.id === concentration) || concentrationOptions[2];

  const freshVal = Math.min(10, Math.max(1, ((selectedTop.freshness + selectedHeart.freshness + selectedBase.freshness) / 3) * activeConc.freshMult));
  const warmVal = Math.min(10, Math.max(1, ((selectedTop.warmth + selectedHeart.warmth + selectedBase.warmth) / 3) * activeConc.warmMult));
  const longVal = Math.min(10, Math.max(1, ((selectedTop.longevity + selectedHeart.longevity + selectedBase.longevity) / 3) * activeConc.longMult));

  const x1 = 100;
  const y1 = 130 - freshVal * 4.0;

  const x2 = 100 - warmVal * 4.0 * 0.866;
  const y2 = 130 + warmVal * 4.0 * 0.5;

  const x3 = 100 + longVal * 4.0 * 0.866;
  const y3 = 130 + longVal * 4.0 * 0.5;

  const polygonPoints = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;

  const recommendedFragrance = getRecommendedFragrance(selectedTop, selectedHeart, selectedBase);
  const dynamicPoetry = getPoeticDescription(selectedTop, selectedHeart, selectedBase);

  // Fetch Bestsellers / Featured Products
  const { data: featuredProducts = [], isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const res = await api.get('/products?sortBy=rating&page=1');
      return res.data.products?.slice(0, 3) || [];
    }
  });

  // Hotspots info mapping
  const hotspots = [
    {
      id: 1,
      name: 'Active Copper Peptides',
      desc: 'Triggers cellular micro-repair, stimulating pro-collagen synthesis and reducing fine lines.',
      top: '28%',
      left: '46%'
    },
    {
      id: 2,
      name: 'Cold-Pressed Squalane',
      desc: 'A plant-derived lipid that mimics skin sebum, sealing in hydration without clogging pores.',
      top: '55%',
      left: '52%'
    },
    {
      id: 3,
      name: 'Organic Rosehip Extract',
      desc: 'Rich in essential trans-retinoic acids and Vitamin C to fade dark spots and boost tone.',
      top: '72%',
      left: '48%'
    }
  ];

  // Active ingredients details mapping
  const ingredientDetails = {
    peptides: {
      name: 'Copper Peptides (GHK-Cu)',
      ph: '5.5 - 6.5',
      numericPh: 6.0,
      safety: 'Clean, Safe for Sensitive Skin',
      pairing: 'Squalane, Ceramides, Hyaluronic Acid',
      desc: 'A naturally occurring copper complex that binds to cell receptors to accelerate dermis repair, firm skin tissues, and increase skin thickness by supporting elastin synthesis.',
      targetProduct: 'Aurelia Golden Hour Peptide Elixir',
      targetSlug: 'aurelia-golden-hour-peptide-elixir'
    },
    gold: {
      name: 'Colloidal 24k Gold Flakes',
      ph: '6.0 - 7.0',
      numericPh: 6.5,
      safety: 'Hypoallergenic, Anti-inflammatory',
      pairing: 'Ceramides NP, Shea Butter, Peptides',
      desc: 'Pure suspension of metallic micro-particles. Gold acts as a natural antioxidant and skin cell stimulator, accelerating blood circulation to calm redness and restore an editorial candlelit glow.',
      targetProduct: 'Aurelia 24k Gold Barrier Cream',
      targetSlug: 'aurelia-24k-gold-barrier-cream'
    },
    resveratrol: {
      name: 'Pure Grape Resveratrol 2%',
      ph: '5.0 - 5.8',
      numericPh: 5.4,
      safety: 'Potent Bio-Active Antioxidant',
      pairing: 'Coenzyme Q10, Vitamin E, Ferulic Acid',
      desc: 'Derived from grape skins, this powerful polyphenol activates skin cell sirtuins (youth enzymes), neutralizing cell-damaging free radicals caused by UV light and pollution.',
      targetProduct: 'Aurelia Resveratrol Active Glow Serum',
      targetSlug: 'aurelia-resveratrol-active-glow-serum'
    },
    vitc: {
      name: 'Vitamin C & Kakadu Plum',
      ph: '3.5 - 4.5',
      numericPh: 4.0,
      safety: 'High Potency, Keep in Cool Place',
      pairing: 'Ferulic Acid, Hyaluronic Acid, Squalane',
      desc: 'Combines stable L-Ascorbic Acid with Kakadu Plum (the world\'s richest source of organic Vitamin C) to block melanin synthesis, fading hyperpigmentation and boosting overall light reflection.',
      targetProduct: 'Aurelia Vitamin C & Kakadu Plum Brightening Serum',
      targetSlug: 'aurelia-vitamin-c-kakadu-plum-brightening-serum'
    },
    ceramides: {
      name: 'Ceramides NP & Lipids',
      ph: '5.5 (Skin Identical)',
      numericPh: 5.5,
      safety: 'Natural Barrier Lipid, Ultra-Gentle',
      pairing: 'Niacinamide, Hyaluronic Acid, Glycerin',
      desc: 'Replicates the natural intercellular cement of the stratum corneum. Re-links skin cells to block moisture evaporation and shield the skin from external irritants.',
      targetProduct: 'Aurelia 24k Gold Barrier Cream',
      targetSlug: 'aurelia-24k-gold-barrier-cream'
    }
  };

  return (
    <div className="space-y-24 pb-16 relative overflow-hidden bg-gradient-to-br from-ivory via-white to-ivory/80 dark:from-obsidian dark:via-black dark:to-obsidian-light/20">
      
      {/* 1. Full Screen Parallax Split Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-plum/10 dark:border-ivory/10 bg-plum/5 dark:bg-black/35">
        {/* Elegant Gold Grid Background */}
        <div 
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(212, 175, 55, 0.4) 1.2px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[150px] -mr-40 -mt-20 animate-pulse" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-plum/5 blur-[120px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 relative z-10">
          {/* Left Hero Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-12 glass-card border border-plum/10 dark:border-ivory/10 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-gold flex items-center justify-center text-[9px] font-serif text-gold tracking-tighter">A</div>
              <span className="text-[10px] tracking-[0.25em] font-bold text-gold uppercase">Molecular Botanical Couture</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-plum dark:text-ivory leading-[1.1] font-bold">
              Elevate Your <br />
              <span className="italic font-light">Moisture Barrier</span>
            </h1>
            <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
              Aurelia curates active copper peptides, cold-pressed plant squalane, and whipped ceramide lipids to restore your natural skin radiance.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link to="/shop" className="btn-plum px-8 shadow-lg shadow-plum/20">Discover Formulas</Link>
              <Link to="/layering-simulator" className="btn-outline px-8 flex items-center gap-2">
                Mixology Lab <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Right Levitating Bottle Model with Hotspots */}
          <div className="relative flex justify-center items-center h-[500px]">
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative w-80 h-80 flex items-center justify-center"
            >
              {/* Gold aura halo glow behind bottle */}
              <div className="absolute inset-0 rounded-full bg-gold/10 blur-3xl" />

              {/* Slow counter-rotating orbital rings */}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none overflow-visible">
                <style>{`
                  @keyframes orbit-rotate-clockwise {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                  @keyframes orbit-rotate-counter {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(-360deg); }
                  }
                  .animate-orbit-cw {
                    animation: orbit-rotate-clockwise 25s linear infinite;
                  }
                  .animate-orbit-ccw {
                    animation: orbit-rotate-counter 35s linear infinite;
                  }
                `}</style>
                <div className="w-[340px] h-[340px] border border-gold/15 rounded-full absolute animate-orbit-cw flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-gold/60 rounded-full absolute top-0" />
                </div>
                <div className="w-[240px] h-[240px] border border-plum/10 dark:border-ivory/10 border-dashed rounded-full absolute animate-orbit-ccw" />
              </div>
              
              <img 
                src="/images/peptide_elixir.png" 
                alt="Aurelia Peptide Elixir" 
                className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(59,24,36,0.15)] dark:drop-shadow-[0_20px_40px_rgba(212,175,55,0.15)] relative z-10"
              />

              {/* Hotspots Overlay */}
              {hotspots.map((h) => (
                <div 
                  key={h.id}
                  className="absolute z-20"
                  style={{ top: h.top, left: h.left }}
                >
                  <button 
                    onMouseEnter={() => setActiveHotspot(h.id)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    onClick={() => setActiveHotspot(activeHotspot === h.id ? null : h.id)}
                    className="relative w-5 h-5 rounded-full bg-gold/40 border border-gold flex items-center justify-center focus:outline-none"
                  >
                    <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-75" />
                    <span className="w-2 h-2 rounded-full bg-gold" />
                  </button>

                  {/* Hotspot Tooltip */}
                  <AnimatePresence>
                    {activeHotspot === h.id && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-7 left-1/2 -translate-x-1/2 w-56 p-3 bg-ivory/95 dark:bg-obsidian/95 border border-gold/40 shadow-xl backdrop-blur-md rounded-none z-30"
                      >
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1">{h.name}</h4>
                        <p className="text-[10px] font-light leading-relaxed text-plum/80 dark:text-ivory/80">{h.desc}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Infinite Brand Marquee Ticker */}
      <div className="bg-plum dark:bg-black/60 border-y border-gold/30 py-3.5 overflow-hidden select-none relative">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
            display: flex;
            width: max-content;
          }
        `}</style>
        <div className="animate-marquee gap-8 text-[10px] uppercase tracking-[0.25em] font-semibold text-gold">
          {Array(4).fill([
            '100% Botanical Couture',
            'Molecular Bio-Science',
            'Cruelty Free',
            'Clinically Proven Formulas',
            'Champagne Gold & Plum Radiance'
          ]).flat().map((text, idx) => (
            <span key={idx} className="flex items-center gap-8">
              <span>{text}</span>
              <span className="text-gold/55">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 3. Featured Categories - Asymmetrical Grid */}
      <section className="space-y-12 max-w-7xl mx-auto px-4">
        <div className="text-center space-y-2 pb-6">
          <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Curated Catalog</span>
          <h2 className="text-3xl font-serif text-plum dark:text-ivory font-bold">Explore our Collections</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:pb-16">
          {[
            {
              index: '01',
              name: 'Skincare Atelier',
              desc: 'Serums, active peptide oils, and rich barrier creams.',
              image: '/images/peptide_elixir.png',
              link: '/shop?category=skincare',
              className: 'md:translate-y-0'
            },
            {
              index: '02',
              name: 'Fragrance Architecture',
              desc: 'Smoky oud wood, warm sandalwood, and night amber.',
              image: '/images/fragrance.png',
              link: '/shop?category=fragrance',
              className: 'md:translate-y-12'
            },
            {
              index: '03',
              name: 'Editorial Cosmetics',
              desc: 'Satin foundations, pigments, and velvet lip jewel lipsticks.',
              image: '/images/lip_jewel.png',
              link: '/shop?category=makeup',
              className: 'md:translate-y-4'
            }
          ].map((cat, i) => (
            <Link 
              to={cat.link} 
              key={i} 
              className={`group block relative overflow-hidden aspect-[4/5] bg-plum/5 border border-plum/10 dark:border-ivory/10 hover:border-gold/50 dark:hover:border-gold/50 transition-all duration-500 shadow-md ${cat.className}`}
            >
              {/* Double Gold-Foil Border overlays on hover */}
              <div className="absolute inset-3.5 border border-gold/0 scale-95 opacity-0 group-hover:border-gold/25 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-10" />
              <div className="absolute inset-4.5 border border-gold/0 scale-95 opacity-0 group-hover:border-gold/15 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 pointer-events-none z-10" />

              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/25 to-transparent flex flex-col justify-end p-6 text-ivory z-10">
                <div className="flex items-center gap-4 mb-1.5 w-full">
                  <span className="font-serif italic text-3xl text-gold/30 font-light block">{cat.index}</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/45 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                </div>
                <h3 className="text-xl font-bold font-serif tracking-wide">{cat.name}</h3>
                <p className="text-xs font-light text-ivory/80 mt-1">{cat.desc}</p>
                <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-gold mt-4 flex items-center gap-1.5 group-hover:text-ivory transition-colors duration-300">
                  Shop Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Interactive Active Ingredients Apothecary Drawer */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Scientific Library</span>
          <h2 className="text-3xl font-serif text-plum dark:text-ivory font-bold">Active Molecular Ingredients</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Toggles List */}
          <div className="lg:col-span-4 flex flex-col justify-center gap-3 bg-plum/5 dark:bg-black/20 p-6 border border-plum/10 dark:border-ivory/10">
            {[
              { id: 'peptides', label: 'Copper Peptides' },
              { id: 'gold', label: 'Colloidal 24k Gold' },
              { id: 'resveratrol', label: 'French Resveratrol' },
              { id: 'vitc', label: 'Vitamin C & Plum' },
              { id: 'ceramides', label: 'Barrier Ceramides' }
            ].map((ing) => (
              <button
                key={ing.id}
                onClick={() => setActiveIngredient(ing.id)}
                className={`w-full text-left px-5 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-between border ${
                  activeIngredient === ing.id
                    ? 'bg-plum text-ivory border-plum dark:bg-gold dark:text-obsidian dark:border-gold font-bold shadow-md shadow-gold/5'
                    : 'bg-transparent text-plum/70 dark:text-ivory/70 border-plum/10 dark:border-ivory/10 hover:border-gold/30 hover:bg-gold/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    activeIngredient === ing.id ? 'bg-gold dark:bg-obsidian scale-125' : 'bg-gold/20'
                  }`} />
                  <span>{ing.label}</span>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  activeIngredient === ing.id ? 'translate-x-1.5' : ''
                }`} />
              </button>
            ))}
          </div>

          {/* Molecule Content Details Display */}
          <div className="lg:col-span-8 p-8 bg-white/40 dark:bg-[#121212] border border-plum/10 dark:border-ivory/10 flex flex-col justify-between shadow-sm relative">
            {/* Background ambient gold flare */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIngredient}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-start border-b border-plum/5 pb-4">
                  <div>
                    <h3 className="text-xl font-serif text-plum dark:text-ivory font-bold">
                      {ingredientDetails[activeIngredient].name}
                    </h3>
                    <p className="text-[10px] tracking-wider text-gold font-bold uppercase mt-1">
                      Cosmetic Profile
                    </p>
                  </div>
                  <span className="text-xs bg-plum/5 dark:bg-gold/10 text-gold px-3 py-1 font-mono">
                    pH: {ingredientDetails[activeIngredient].ph}
                  </span>
                </div>

                {/* Visual pH Scale Bar */}
                <div className="space-y-2 py-2">
                  <div className="flex justify-between items-center text-[9px] uppercase tracking-wider text-gold font-bold">
                    <span>pH Balance Meter</span>
                  </div>
                  <div className="relative h-1.5 bg-plum/10 dark:bg-ivory/15 rounded-full overflow-visible mt-2">
                    {/* Colored gradient track */}
                    <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-gold/45 via-gold/15 to-transparent rounded-full" />
                    {/* Exact pH dot */}
                    <div 
                      className="absolute w-3.5 h-3.5 rounded-full bg-gold border-2 border-white dark:border-[#121212] -top-1.5 shadow transition-all duration-500 flex items-center justify-center"
                      style={{
                        left: `calc(${((ingredientDetails[activeIngredient].numericPh || 5.5) / 14) * 100}% - 7px)`
                      }}
                    >
                      <span className="w-1 h-1 rounded-full bg-plum dark:bg-obsidian" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[8px] text-plum/45 dark:text-ivory/45 font-mono pt-1">
                    <span>1 (Acidic)</span>
                    <span>7 (Neutral)</span>
                    <span>14 (Alkaline)</span>
                  </div>
                </div>

                <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed pt-2">
                  {ingredientDetails[activeIngredient].desc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="p-3.5 bg-plum/5 dark:bg-ivory/5 border border-plum/5">
                    <span className="text-[9px] uppercase tracking-wider text-gold font-bold block mb-1">Safety Diagnostic</span>
                    <span className="text-plum dark:text-ivory font-medium">{ingredientDetails[activeIngredient].safety}</span>
                  </div>
                  <div className="p-3.5 bg-plum/5 dark:bg-ivory/5 border border-plum/5">
                    <span className="text-[9px] uppercase tracking-wider text-gold font-bold block mb-1">Synergistic Pairings</span>
                    <span className="text-plum dark:text-ivory font-medium">{ingredientDetails[activeIngredient].pairing}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-plum/5 flex items-center justify-between">
                  <div className="text-xs text-plum/50 dark:text-ivory/50">
                    Featured In:{' '}
                    <span className="font-semibold text-plum dark:text-ivory">
                      {ingredientDetails[activeIngredient].targetProduct}
                    </span>
                  </div>
                  <Link 
                    to={`/product/${ingredientDetails[activeIngredient].targetSlug}`} 
                    className="text-xs uppercase tracking-widest text-gold hover:text-plum dark:hover:text-ivory flex items-center gap-1.5 font-bold transition-colors"
                  >
                    View Formulation <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4.5 Virtual Olfactory Note Blender */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Scent Architecture</span>
          <h2 className="text-3xl font-serif text-plum dark:text-ivory font-bold">Virtual Olfactory Note Blender</h2>
          <p className="text-xs font-light text-plum/60 dark:text-ivory/60 max-w-lg mx-auto">
            Orchestrate your bespoke olfactory accord. Toggle luxury essence notes to adjust the architectural radar signature and discover matching Aurelia formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Note Toggles Grid (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-6 bg-plum/5 dark:bg-black/20 p-6 border border-plum/10 dark:border-ivory/10">
            {/* Top Notes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gold/20 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">01. Volatile Top Notes</span>
                <span className="text-[9px] font-mono text-plum/45 dark:text-ivory/45">First Impression</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {topNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedTop(note)}
                    className={`text-left p-3.5 border transition-all duration-300 relative ${
                      selectedTop.id === note.id
                        ? 'bg-plum text-ivory border-plum dark:bg-gold dark:text-obsidian dark:border-gold shadow-md'
                        : 'bg-transparent text-plum/70 dark:text-ivory/70 border-plum/10 dark:border-ivory/10 hover:border-gold/30 hover:bg-gold/5'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs">{note.name}</div>
                    <div className={`text-[9px] font-light mt-1 line-clamp-2 leading-relaxed ${
                      selectedTop.id === note.id ? 'text-ivory/80 dark:text-obsidian/85' : 'text-plum/50 dark:text-ivory/50'
                    }`}>
                      {note.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Heart Notes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gold/20 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">02. Core Heart Notes</span>
                <span className="text-[9px] font-mono text-plum/45 dark:text-ivory/45">Personality & Sillage</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {heartNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedHeart(note)}
                    className={`text-left p-3.5 border transition-all duration-300 relative ${
                      selectedHeart.id === note.id
                        ? 'bg-plum text-ivory border-plum dark:bg-gold dark:text-obsidian dark:border-gold shadow-md'
                        : 'bg-transparent text-plum/70 dark:text-ivory/70 border-plum/10 dark:border-ivory/10 hover:border-gold/30 hover:bg-gold/5'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs">{note.name}</div>
                    <div className={`text-[9px] font-light mt-1 line-clamp-2 leading-relaxed ${
                      selectedHeart.id === note.id ? 'text-ivory/80 dark:text-obsidian/85' : 'text-plum/50 dark:text-ivory/50'
                    }`}>
                      {note.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Base Notes */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gold/20 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">03. Grounding Base Notes</span>
                <span className="text-[9px] font-mono text-plum/45 dark:text-ivory/45">Tenacity & Depth</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {baseNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedBase(note)}
                    className={`text-left p-3.5 border transition-all duration-300 relative ${
                      selectedBase.id === note.id
                        ? 'bg-plum text-ivory border-plum dark:bg-gold dark:text-obsidian dark:border-gold shadow-md'
                        : 'bg-transparent text-plum/70 dark:text-ivory/70 border-plum/10 dark:border-ivory/10 hover:border-gold/30 hover:bg-gold/5'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs">{note.name}</div>
                    <div className={`text-[9px] font-light mt-1 line-clamp-2 leading-relaxed ${
                      selectedBase.id === note.id ? 'text-ivory/80 dark:text-obsidian/85' : 'text-plum/50 dark:text-ivory/50'
                    }`}>
                      {note.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Infusion Concentration */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center border-b border-gold/20 pb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">04. Infusion Concentration</span>
                <span className="text-[9px] font-mono text-plum/45 dark:text-ivory/45">Sillage Power</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {concentrationOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setConcentration(opt.id)}
                    className={`text-left p-3.5 border transition-all duration-300 relative ${
                      concentration === opt.id
                        ? 'bg-plum text-ivory border-plum dark:bg-gold dark:text-obsidian dark:border-gold shadow-md'
                        : 'bg-transparent text-plum/70 dark:text-ivory/70 border-plum/10 dark:border-ivory/10 hover:border-gold/30 hover:bg-gold/5'
                    }`}
                  >
                    <div className="font-serif font-bold text-xs">{opt.name}</div>
                    <div className={`text-[8px] font-light mt-1 leading-normal ${
                      concentration === opt.id ? 'text-ivory/80 dark:text-obsidian/85' : 'text-plum/50 dark:text-ivory/50'
                    }`}>
                      {opt.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scent Radar & Recommendation Display (5 columns) */}
          <div className="lg:col-span-5 p-6 bg-white/40 dark:bg-[#121212] border border-plum/10 dark:border-ivory/10 flex flex-col justify-between shadow-sm relative overflow-hidden">
            {/* Ambient visual background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />

            {/* Radar Canvas Container with luxury perfume bottle silhouette */}
            <div className="flex flex-col items-center py-4 border-b border-plum/5 pb-4">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <svg width="220" height="220" viewBox="0 0 200 200" className="overflow-visible">
                  <defs>
                    <radialGradient id="goldGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#d4af37" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#c5a028" stopOpacity="0.15" />
                    </radialGradient>
                    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Perfume Bottle Cap */}
                  <rect x="85" y="25" width="30" height="20" fill="none" stroke="#d4af37" strokeWidth="1.5" rx="2" strokeOpacity="0.5" />
                  {/* Perfume Bottle Neck */}
                  <line x1="90" y1="45" x2="90" y2="55" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.5" />
                  <line x1="110" y1="45" x2="110" y2="55" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.5" />
                  {/* Perfume Bottle Body Outline */}
                  <path d="M 90,55 C 75,55 60,60 55,75 L 55,175 C 55,180 60,185 65,185 L 135,185 C 140,185 145,180 145,175 L 145,75 C 140,60 125,55 110,55 Z" fill="none" stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.7" />
                  {/* Glass Thickness Bottom Reflection */}
                  <path d="M 60,178 L 140,178" stroke="#d4af37" strokeWidth="1" strokeOpacity="0.3" />

                  {/* Concentric Grid Triangles centered at 100, 130 */}
                  {[3, 6, 9].map((lvl, index) => {
                    const r = lvl * 4.0;
                    const tx1 = 100;
                    const ty1 = 130 - r;
                    const tx2 = 100 - r * 0.866;
                    const ty2 = 130 + r * 0.5;
                    const tx3 = 100 + r * 0.866;
                    const ty3 = 130 + r * 0.5;
                    return (
                      <polygon
                        key={index}
                        points={`${tx1},${ty1} ${tx2},${ty2} ${tx3},${ty3}`}
                        fill="none"
                        stroke="#d4af37"
                        strokeOpacity="0.15"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                    );
                  })}

                  {/* Axis lines from (100, 130) */}
                  {/* Freshness Axis (Up) */}
                  <line x1="100" y1="130" x2="100" y2="85" stroke="#d4af37" strokeOpacity="0.2" strokeWidth="1" />
                  {/* Warmth Axis (Down-Left) */}
                  <line x1="100" y1="130" x2="61" y2="152.5" stroke="#d4af37" strokeOpacity="0.2" strokeWidth="1" />
                  {/* Longevity Axis (Down-Right) */}
                  <line x1="100" y1="130" x2="139" y2="152.5" stroke="#d4af37" strokeOpacity="0.2" strokeWidth="1" />

                  {/* Axis Label Text */}
                  <text x="100" y="80" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold" letterSpacing="0.5" className="font-mono">FRESHNESS</text>
                  <text x="45" y="162" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold" letterSpacing="0.5" className="font-mono">WARMTH</text>
                  <text x="155" y="162" textAnchor="middle" fill="#d4af37" fontSize="8" fontWeight="bold" letterSpacing="0.5" className="font-mono">LONGEVITY</text>

                  {/* Center Hub dot */}
                  <circle cx="100" cy="130" r="3" fill="#d4af37" fillOpacity="0.6" />

                  {/* Scent Accord Shape Polygon */}
                  <polygon
                    points={polygonPoints}
                    fill="url(#goldGradient)"
                    stroke="#d4af37"
                    strokeWidth="2"
                    filter="url(#goldGlow)"
                    className="transition-all duration-500 ease-in-out"
                  />

                  {/* Axis Marker Dots */}
                  <circle cx={x1} cy={y1} r="3.5" fill="#d4af37" className="transition-all duration-500 ease-in-out" />
                  <circle cx={x2} cy={y2} r="3.5" fill="#d4af37" className="transition-all duration-500 ease-in-out" />
                  <circle cx={x3} cy={y3} r="3.5" fill="#d4af37" className="transition-all duration-500 ease-in-out" />
                </svg>
              </div>

              {/* Olfactory readouts in percentages */}
              <div className="flex gap-6 mt-4 text-[10px] font-mono tracking-wider text-gold font-bold">
                <div className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-gold" />
                  <span>FRESH: {Math.round(freshVal * 10)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-gold" />
                  <span>WARM: {Math.round(warmVal * 10)}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold" />
                  <span>LONG: {Math.round(longVal * 10)}%</span>
                </div>
              </div>
            </div>

            {/* dynamic poetic description */}
            <div className="text-center px-4 py-2 border-b border-plum/5">
              <p className="text-[10px] italic font-serif text-plum/60 dark:text-ivory/60 leading-relaxed max-w-sm mx-auto">
                "{dynamicPoetry}"
              </p>
            </div>

            {/* Recommended Scent Card */}
            <div className="pt-4 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[8px] uppercase tracking-widest text-gold font-bold block mb-1">Architect Recommendation</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-serif font-bold text-plum dark:text-ivory">{recommendedFragrance.name}</h4>
                  <span className="text-[8px] border border-gold/45 text-gold px-1.5 py-0.5 rounded-none font-mono uppercase font-bold">
                    {activeConc.name}
                  </span>
                </div>
                <p className="text-[10px] font-light text-plum/70 dark:text-ivory/70 leading-relaxed mt-2">
                  {recommendedFragrance.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-plum/5 pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <img
                    src={recommendedFragrance.image}
                    alt={recommendedFragrance.name}
                    className="w-10 h-10 object-contain bg-plum/5 border border-plum/10 dark:border-ivory/10"
                  />
                  <div className="text-[10px] font-mono text-gold font-bold uppercase">MATCHING FORMULA</div>
                </div>
                <Link
                  to={`/product/${recommendedFragrance.slug}`}
                  className="text-xs uppercase tracking-widest text-gold hover:text-plum dark:hover:text-ivory flex items-center gap-1.5 font-bold transition-colors"
                >
                  Discover Accord <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bestselling Carousel */}
      <section className="space-y-8 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end border-b border-plum/5 dark:border-ivory/5 pb-4">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Highly Rated</span>
            <h2 className="text-3xl font-serif text-plum dark:text-ivory font-bold">Bestselling Formulas</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase font-bold tracking-widest text-plum dark:text-ivory hover:text-gold flex items-center gap-1">
            Shop All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts?.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 6. Brand Editorial Teaser */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center bg-plum/5 dark:bg-black/35 p-8 sm:p-16 border-y border-plum/10 dark:border-ivory/10 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-6 max-w-lg">
          <div className="flex flex-col gap-2">
            <span className="font-serif italic text-sm text-gold block opacity-85">Chapter IV: On the Alchemy of Moisture Seal</span>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-5 h-5 text-gold" />
              <span className="text-[10px] tracking-[0.2em] font-bold text-gold uppercase">Aurelia Editorial Journal</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl leading-tight text-plum dark:text-ivory font-bold">
            The Science of <br />
            <span className="italic font-light">Custom Layering</span>
          </h2>
          <p className="text-sm font-light text-plum/70 dark:text-ivory/70 leading-relaxed">
            Dermatologists confirm that layering serums from lowest density to thickest lipid seals active hydration molecules. Learn how to map your routines with our virtual builder.
          </p>
          <div className="flex gap-4">
            <Link to="/layering-simulator" className="btn-plum text-xs">Test compatibility</Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-plum/5 border border-plum/10 dark:border-ivory/10 shadow-xl group">
          {/* Offset gold shadow border */}
          <div className="absolute -inset-2 border border-gold/25 translate-x-2 translate-y-2 pointer-events-none group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
          <img 
            src="/images/hero_editorial.png" 
            alt="Layering editorial" 
            className="w-full h-full object-cover opacity-85 dark:opacity-75 relative z-10"
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
