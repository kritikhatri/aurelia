import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Coupon from '../models/Coupon.js';
import BlogPost from '../models/BlogPost.js';

export const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Coupon.deleteMany({});
    await BlogPost.deleteMany({});
    console.log('Cleared existing database collections...');

    // 1. Seed Users
    await User.create({
      name: 'Aurelia Admin',
      email: 'admin@aurelia.com',
      passwordHash: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      emailVerified: true
    });

    await User.create({
      name: 'Elena Rostova',
      email: 'customer@aurelia.com',
      passwordHash: 'customer123',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      skinType: 'Dry',
      skinConcerns: ['Aging', 'Dullness'],
      rewardPoints: 120,
      referralCode: 'AURELIA-ELENA9'
    });

    console.log('Seeded User accounts.');

    // 2. Seed Categories
    const categoriesData = [
      { name: 'Skincare', slug: 'skincare', description: 'Scientific formulations for radiant skin.' },
      { name: 'Makeup', slug: 'makeup', description: 'Luxury cosmetic pigments for display and wear.' },
      { name: 'Haircare', slug: 'haircare', description: 'Nourishing serums and botanicals for hair health.' },
      { name: 'Fragrance', slug: 'fragrance', description: 'Olfactory statements and luxury perfumes.' },
      { name: 'Body Care', slug: 'body-care', description: 'Sensorial body exfoliants and rich creams.' }
    ];

    const seededCats = await Category.insertMany(categoriesData);
    console.log('Seeded Categories.');

    const catMap = seededCats.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {});

    // Subcategory
    const serumsSub = await Category.create({
      name: 'Serums & Oils',
      slug: 'serums-oils',
      parentCategory: catMap['skincare'],
      description: 'Concentrated active blends.'
    });

    // 3. Seed Products (30 items)
    const productsData = [
      {
        name: 'Golden Hour Peptide Elixir',
        slug: 'golden-hour-peptide-elixir',
        description: 'An ultra-lightweight botanical facial oil enriched with active copper peptides and squalane. Refines pores and grants a natural, luminous skin dew.',
        category: catMap['skincare'],
        subCategory: serumsSub._id,
        price: 78,
        compareAtPrice: 95,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        stock: 45,
        ingredients: ['Squalane', 'Copper Tripeptide-1', 'Rosehip Oil', 'Jojoba Seed Extract', 'Tocopherol'],
        skinTypeSuitability: ['Dry', 'Combo', 'Normal'],
        tags: ['bestseller', 'anti-aging', 'hydration'],
        ratingsAvg: 4.8,
        ratingsCount: 24,
        isFeatured: true,
        variants: [
          { name: '30ml', type: 'size', price: 78, stock: 30 },
          { name: '50ml', type: 'size', price: 110, stock: 15 }
        ]
      },
      {
        name: 'Velvet Hydra-Infusion Cream',
        slug: 'velvet-hydra-infusion-cream',
        description: 'A luxurious daily moisturizer blending multi-molecular weight hyaluronic acids with ceramides to lock in moisture and reinforce the skin barrier.',
        category: catMap['skincare'],
        price: 64,
        images: ['https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500'],
        stock: 35,
        ingredients: ['Ceramide NP', 'Hyaluronic Acid', 'Shea Butter', 'Centella Asiatica', 'Panthenol'],
        skinTypeSuitability: ['Dry', 'Sensitive', 'Normal'],
        tags: ['hydration', 'barrier-repair'],
        ratingsAvg: 4.9,
        ratingsCount: 18,
        isFeatured: true
      },
      {
        name: 'Oatmeal Rosewater Gel Cleanser',
        slug: 'oatmeal-rosewater-gel-cleanser',
        description: 'A pH-balanced foaming gel cleanser that removes dirt and makeup without stripping natural protective oils.',
        category: catMap['skincare'],
        price: 32,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        stock: 60,
        ingredients: ['Colloidal Oatmeal', 'Rosewater', 'Aloe Barbadensis', 'Glycerin'],
        skinTypeSuitability: ['Sensitive', 'Dry', 'Combo', 'Normal', 'Oily'],
        tags: ['cleanse', 'gentle'],
        ratingsAvg: 4.7,
        ratingsCount: 42
      },
      {
        name: 'Overnight Resurfacing AHA Peel',
        slug: 'overnight-resurfacing-aha-peel',
        description: 'A 10% Glycolic and Lactic Acid resurfacing concentrate that exfoliates dead cells for smooth texture and even tone.',
        category: catMap['skincare'],
        price: 52,
        images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500'],
        stock: 20,
        ingredients: ['Glycolic Acid', 'Lactic Acid', 'Salicylic Acid', 'Green Tea Extract'],
        skinTypeSuitability: ['Combo', 'Oily', 'Normal'],
        tags: ['exfoliate', 'peel'],
        ratingsAvg: 4.5,
        ratingsCount: 15
      },
      {
        name: 'Celestial Caffeine Eye Balm',
        slug: 'celestial-caffeine-eye-balm',
        description: 'Rich, whipped eye cream containing caffeine and red ginseng to reduce puffiness and dark circles.',
        category: catMap['skincare'],
        price: 48,
        images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500'],
        stock: 50,
        ingredients: ['Caffeine', 'Ginseng Root Extract', 'Shea Butter', 'Squalane'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['eyes', 'caffeine'],
        ratingsAvg: 4.6,
        ratingsCount: 30
      },
      {
        name: 'Sun Veil Lightweight SPF 50',
        slug: 'sun-veil-lightweight-spf-50',
        description: 'A mineral broad-spectrum sunscreen that leaves no white cast, featuring non-nano zinc oxide and antioxidant plum extract.',
        category: catMap['skincare'],
        price: 38,
        images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500'],
        stock: 100,
        ingredients: ['Zinc Oxide 19%', 'Kakadu Plum Extract', 'Vitamin E', 'Hyaluronic Acid'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['sunscreen', 'daily'],
        ratingsAvg: 4.8,
        ratingsCount: 56,
        isFeatured: true
      },
      {
        name: 'Niacinamide Radiance Serum',
        slug: 'niacinamide-radiance-serum',
        description: 'A 10% niacinamide and zinc serum that balances sebum production and minimizes skin redness.',
        category: catMap['skincare'],
        subCategory: serumsSub._id,
        price: 45,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        stock: 40,
        ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Allantoin', 'Licorice Root Extract'],
        skinTypeSuitability: ['Oily', 'Combo', 'Normal'],
        tags: ['sebum-control', 'redness'],
        ratingsAvg: 4.7,
        ratingsCount: 29
      },
      {
        name: 'Squalane Melting Cleansing Balm',
        slug: 'squalane-melting-cleansing-balm',
        description: 'A nourishing balm-to-oil cleanser that melts away waterproof makeup, excess oil, and sunscreen effortlessly.',
        category: catMap['skincare'],
        price: 36,
        images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500'],
        stock: 55,
        ingredients: ['Squalane', 'Sweet Almond Oil', 'Sunflower Seed Oil', 'Vitamin E'],
        skinTypeSuitability: ['Dry', 'Sensitive', 'Normal'],
        tags: ['cleanse', 'balm'],
        ratingsAvg: 4.9,
        ratingsCount: 33
      },

      // Makeup (9-14)
      {
        name: 'Satin Silk Breathable Foundation',
        slug: 'satinsilk-breathable-foundation',
        description: 'A buildable medium-coverage foundation that leaves a satin, skin-like finish. Infused with skin-loving glycerin.',
        category: catMap['makeup'],
        price: 58,
        images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'],
        stock: 80,
        ingredients: ['Glycerin', 'Squalane', 'Silica', 'Titanium Dioxide'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Normal'],
        tags: ['makeup', 'foundation', 'bestseller'],
        ratingsAvg: 4.6,
        ratingsCount: 50,
        variants: [
          { name: 'Fair Ivory', type: 'shade', stock: 20 },
          { name: 'Warm Honey', type: 'shade', stock: 20 },
          { name: 'Rich Amber', type: 'shade', stock: 20 },
          { name: 'Deep Cocoa', type: 'shade', stock: 20 }
        ]
      },
      {
        name: 'Dewy Veil Illuminating Primer',
        slug: 'dewyveil-illuminating-primer',
        description: 'A lightweight hydrating gel primer packed with gold pearls to grip makeup and offer an editorial candlelit glow.',
        category: catMap['makeup'],
        price: 44,
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'],
        stock: 40,
        ingredients: ['Gold Micro-Pearls', 'Glycerin', 'Niacinamide'],
        skinTypeSuitability: ['Dry', 'Combo', 'Sensitive', 'Normal'],
        tags: ['primer', 'glow'],
        ratingsAvg: 4.8,
        ratingsCount: 22,
        isFeatured: true
      },
      {
        name: 'Velvet Lip Jewel Lipstick',
        slug: 'velvet-lip-jewel-lipstick',
        description: 'A luxury matte lipstick presented in an elegant obsidian container. Yields intense color payoff in a single swipe.',
        category: catMap['makeup'],
        price: 38,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'],
        stock: 90,
        ingredients: ['Cocoa Butter', 'Carnauba Wax', 'Rosehip Oil', 'Pure Pigment Concentrate'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Normal'],
        tags: ['lips', 'lipstick'],
        ratingsAvg: 4.9,
        ratingsCount: 65,
        variants: [
          { name: 'Obsidian Red', type: 'shade', stock: 30 },
          { name: 'Blush Plum', type: 'shade', stock: 30 },
          { name: 'Bare Nude', type: 'shade', stock: 30 }
        ]
      },
      {
        name: 'Celestial Baked Gold Highlighter',
        slug: 'celestial-baked-gold-highlighter',
        description: 'Baked powder highlighter reflecting multidimensional gold shimmer. Gives a high-end editorial wet look.',
        category: catMap['makeup'],
        price: 42,
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500'],
        stock: 30,
        ingredients: ['Mica', 'Gold Micro-shimmer', 'Macadamia Seed Oil'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Normal'],
        tags: ['highlighter', 'shimmer'],
        ratingsAvg: 4.7,
        ratingsCount: 14
      },
      {
        name: 'Precision Ink Eyeliner',
        slug: 'precision-ink-eyeliner',
        description: 'Waterproof liquid eyeliner with an ultra-fine felt tip for flawless wing definition. Rich obsidian black.',
        category: catMap['makeup'],
        price: 28,
        images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500'],
        stock: 50,
        ingredients: ['Aqua', 'Charcoal Powder Pigments', 'Acrylates Copolymer'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['eyeliner', 'waterproof'],
        ratingsAvg: 4.5,
        ratingsCount: 38
      },
      {
        name: 'Volumizing Lash Serum Mascara',
        slug: 'volumizing-lash-serum-mascara',
        description: 'A conditioning deep-black mascara formulated with biotin to promote longer, stronger natural eyelashes.',
        category: catMap['makeup'],
        price: 34,
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500'],
        stock: 65,
        ingredients: ['Biotin', 'Keratin', 'Obsidian Carbon Black', 'Panthenol'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['mascara', 'eyes'],
        ratingsAvg: 4.6,
        ratingsCount: 29
      },

      // Haircare (15-20)
      {
        name: 'Royal Rosehip Botanical Shampoo',
        slug: 'royal-rosehip-botanical-shampoo',
        description: 'Sulfate-free restorative shampoo carrying rosehip and organic argan oil to nourish dull hair cuticles.',
        category: catMap['haircare'],
        price: 36,
        images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500'],
        stock: 45,
        ingredients: ['Rosehip Extract', 'Argan Oil', 'Coconut Glucoside', 'Aloe Juice'],
        skinTypeSuitability: ['Dry', 'Combo', 'Normal'],
        tags: ['shampoo', 'sulfate-free'],
        ratingsAvg: 4.7,
        ratingsCount: 31
      },
      {
        name: 'Silk Infusion Smoothing Conditioner',
        slug: 'silk-infusion-smoothing-conditioner',
        description: 'A protein-rich conditioner that detangles and locks in moisture, leaving hair feeling like silk satin.',
        category: catMap['haircare'],
        price: 38,
        images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500'],
        stock: 45,
        ingredients: ['Hydrolyzed Silk Protein', 'Panthenol', 'Jojoba Oil'],
        skinTypeSuitability: ['Dry', 'Normal'],
        tags: ['conditioner', 'smoothing'],
        ratingsAvg: 4.8,
        ratingsCount: 19
      },
      {
        name: 'Miracle Repair Shea Hair Mask',
        slug: 'miracle-repair-shea-hair-mask',
        description: 'A deep-conditioning repair treatment mask targeting heat-damaged and color-treated hair.',
        category: catMap['haircare'],
        price: 48,
        images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500'],
        stock: 30,
        ingredients: ['Shea Butter', 'Keratin Amino Acids', 'Marula Seed Oil'],
        skinTypeSuitability: ['Dry', 'Combo', 'Normal'],
        tags: ['hair-mask', 'repair'],
        ratingsAvg: 4.9,
        ratingsCount: 25,
        isFeatured: true
      },
      {
        name: 'Marula Golden Gloss Hair Oil',
        slug: 'marula-golden-gloss-hair-oil',
        description: 'Frizz-reducing hair finish oil with jasmine petals and cold-pressed marula oil. Non-greasy finish.',
        category: catMap['haircare'],
        price: 52,
        images: ['https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=500'],
        stock: 35,
        ingredients: ['Marula Oil', 'Jasmine Flower Extract', 'Sweet Almond Oil'],
        skinTypeSuitability: ['Dry', 'Normal'],
        tags: ['hair-oil', 'gloss'],
        ratingsAvg: 4.8,
        ratingsCount: 16
      },
      {
        name: 'Scalp Detox Sea Salt Scrub',
        slug: 'scalp-detox-sea-salt-scrub',
        description: 'An exfoliating scrub shampoo containing mineral sea salt crystals to remove scalp buildup.',
        category: catMap['haircare'],
        price: 42,
        images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500'],
        stock: 25,
        ingredients: ['Sea Salt Crystals', 'Eucalyptus Leaf Oil', 'Tea Tree Oil'],
        skinTypeSuitability: ['Oily', 'Combo', 'Normal'],
        tags: ['scalp-scrub', 'detox'],
        ratingsAvg: 4.6,
        ratingsCount: 18
      },
      {
        name: 'Keratin Volume Mist',
        slug: 'keratin-volume-mist',
        description: 'A light spray styling mist that thickens fine hair strands and adds root volume without stiffness.',
        category: catMap['haircare'],
        price: 34,
        images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500'],
        stock: 40,
        ingredients: ['Hydrolyzed Keratin', 'Biotin', 'Wheat Protein'],
        skinTypeSuitability: ['Normal', 'Combo', 'Dry'],
        tags: ['volume', 'spray'],
        ratingsAvg: 4.5,
        ratingsCount: 12
      },

      // Fragrance (21-25)
      {
        name: 'Vespera Night Eau de Parfum',
        slug: 'vespera-night-eau-de-parfum',
        description: 'An editorial perfume statement. A rich blend of midnight black amber, sensual jasmine, and dark plum.',
        category: catMap['fragrance'],
        price: 115,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'],
        stock: 25,
        ingredients: ['Organic Alcohol Base', 'Perfume Oils', 'Jasmine Concentrate', 'Amber Accord'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['perfume', 'luxury', 'bestseller'],
        ratingsAvg: 4.9,
        ratingsCount: 88,
        isFeatured: true,
        variants: [
          { name: '50ml', type: 'size', price: 115, stock: 15 },
          { name: '100ml', type: 'size', price: 175, stock: 10 }
        ]
      },
      {
        name: 'Aura Gold Sandalwood Parfum',
        slug: 'aura-gold-sandalwood-parfum',
        description: 'A warm, radiant blend of spicy bergamot, creamy sandalwood, and Madagascar vanilla pod extracts.',
        category: catMap['fragrance'],
        price: 120,
        images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500'],
        stock: 20,
        ingredients: ['Sandalwood Extract', 'Bergamot Essential Oil', 'Vanilla Planifolia'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['perfume', 'warm'],
        ratingsAvg: 4.8,
        ratingsCount: 42
      },
      {
        name: 'Soleil Blanc Tiare Cologne',
        slug: 'soleil-blanc-tiare-cologne',
        description: 'A breezy cologne capturing sweet coconut water, tropical tiare flower petals, and sea salt.',
        category: catMap['fragrance'],
        price: 98,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 30,
        ingredients: ['Coconut Oil Base', 'Tiare Flower Essence', 'Sea Salt Accord'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['cologne', 'fresh'],
        ratingsAvg: 4.7,
        ratingsCount: 20
      },
      {
        name: 'Bois de Oud Intense',
        slug: 'bois-de-oud-intense',
        description: 'Deep, smoky oud wood balanced with dark patchouli leaves and a subtle touch of rose petals.',
        category: catMap['fragrance'],
        price: 135,
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'],
        stock: 15,
        ingredients: ['Oud Essence', 'Patchouli Leaves Oil', 'Rosa Damascena'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['oud', 'woody'],
        ratingsAvg: 4.9,
        ratingsCount: 31
      },
      {
        name: 'Bergamot Bloom Eau de Toilette',
        slug: 'bergamot-bloom-eau-de-toilette',
        description: 'A light, crisp fragrance highlighting fresh cold-pressed Italian bergamot, lemon blossom, and neroli.',
        category: catMap['fragrance'],
        price: 85,
        images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500'],
        stock: 40,
        ingredients: ['Citrus Oils', 'Neroli Blossom Essence', 'Musk Base'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Sensitive', 'Normal'],
        tags: ['edt', 'citrus'],
        ratingsAvg: 4.6,
        ratingsCount: 15
      },

      // Body Care (26-30+)
      {
        name: 'Crème de la Crème Body Butter',
        slug: 'creme-de-la-creme-body-butter',
        description: 'Rich, whipped body butter made of raw shea butter and dark vanilla orchid extract. Hydrates for 24 hours.',
        category: catMap['body-care'],
        price: 46,
        images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500'],
        stock: 50,
        ingredients: ['Shea Butter', 'Cocoa Seed Butter', 'Vanilla Extract', 'Argan Oil'],
        skinTypeSuitability: ['Dry', 'Sensitive', 'Normal'],
        tags: ['body-butter', 'hydration'],
        ratingsAvg: 4.9,
        ratingsCount: 52,
        isFeatured: true
      },
      {
        name: 'Golden Shimmer Dry Body Oil',
        slug: 'golden-shimmer-dry-body-oil',
        description: 'A dry satin body oil infused with 24k gold shimmer flakes and hydrating argan oil. Instantly absorbs.',
        category: catMap['body-care'],
        price: 58,
        images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500'],
        stock: 30,
        ingredients: ['Argan Oil', '24k Gold Flakes', 'Macadamia Nut Oil', 'Vitamin E'],
        skinTypeSuitability: ['Dry', 'Combo', 'Normal'],
        tags: ['body-oil', 'shimmer'],
        ratingsAvg: 4.8,
        ratingsCount: 28,
        isFeatured: true
      },
      {
        name: 'Nourishing Lavender Hand Balm',
        slug: 'nourishing-lavender-hand-balm',
        description: 'A restorative, non-sticky hand treatment balm infused with French lavender oil and honey extract.',
        category: catMap['body-care'],
        price: 24,
        images: ['https://images.unsplash.com/photo-1617897903246-719242758050?w=500'],
        stock: 75,
        ingredients: ['Lavender Essential Oil', 'Honey Extract', 'Shea Butter', 'Glycerin'],
        skinTypeSuitability: ['Dry', 'Sensitive', 'Normal'],
        tags: ['hands', 'relaxing'],
        ratingsAvg: 4.7,
        ratingsCount: 40
      },
      {
        name: 'Eucalyptus Purifying Body Wash',
        slug: 'eucalyptus-purifying-body-wash',
        description: 'An aromatherapy body wash carrying high concentrations of eucalyptus essential oil to energize and refresh.',
        category: catMap['body-care'],
        price: 28,
        images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'],
        stock: 80,
        ingredients: ['Eucalyptus Leaf Oil', 'Aloe Leaf Juice', 'Sea Kelp Extract'],
        skinTypeSuitability: ['Dry', 'Combo', 'Oily', 'Normal'],
        tags: ['body-wash', 'purifying'],
        ratingsAvg: 4.6,
        ratingsCount: 37
      },
      {
        name: 'Crushed Almond Body Scrub',
        slug: 'crushed-almond-body-scrub',
        description: 'A polishing body scrub featuring crushed sweet almond shells and nourishing almond oil to smooth rough patches.',
        category: catMap['body-care'],
        price: 36,
        images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500'],
        stock: 45,
        ingredients: ['Crushed Almond Shells', 'Sweet Almond Oil', 'Shea Butter'],
        skinTypeSuitability: ['Dry', 'Normal'],
        tags: ['exfoliate', 'almond'],
        ratingsAvg: 4.8,
        ratingsCount: 22
      }
    ];

    await Product.insertMany(productsData);
    console.log('Seeded 30 Products.');

    // 4. Seed Coupons
    const couponsData = [
      {
        code: 'AURELIA15',
        type: 'percentage',
        value: 15,
        minSpend: 50,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 500
      },
      {
        code: 'GLOW50',
        type: 'fixed',
        value: 50,
        minSpend: 150,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 100
      },
      {
        code: 'LUXE10',
        type: 'percentage',
        value: 10,
        minSpend: 0,
        expiryDate: new Date('2028-12-31'),
        usageLimit: null
      }
    ];

    await Coupon.insertMany(couponsData);
    console.log('Seeded Promotion Coupons.');

    // 5. Seed Blog Posts (10 posts)
    const blogPostsData = [
      {
        title: 'The Science of Copper Peptides in Skincare',
        slug: 'science-of-copper-peptides-skincare',
        author: 'Dr. Clara Sterling',
        content: 'Copper peptides are renowned in cosmetic dermatology for their wound-healing and skin remodeling properties. This article explores how they promote collagen synthesis, reduce fine lines, and support structural skin proteins. When paired with nourishing oils like squalane, they serve as a powerful tool in any anti-aging routine.',
        coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        tags: ['Peptides', 'Ingredients', 'Anti-Aging'],
        metaTitle: 'Guide to Copper Peptides | Aurelia Science',
        metaDescription: 'Discover how copper peptides work to stimulate collagen and regenerate skin elasticity.'
      },
      {
        title: 'How to Determine Your Real Skin Type',
        slug: 'determine-real-skin-type',
        author: 'Aurelia Estheticians',
        content: 'Many people misdiagnose their skin type, leading to incorrect product choices. Learn the bare-face wash test: wash your face with a gentle cleanser, pat dry, and leave it bare for 30 minutes. If it feels tight, you have Dry skin. If shiny on the T-zone, you have Combo. If shiny all over, it is Oily. Sensitive skin shows redness or itching.',
        coverImage: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500',
        tags: ['Skincare Routine', 'Skin Type', 'Education'],
        metaTitle: 'What is My Skin Type? | Aurelia Skincare',
        metaDescription: 'Find your skin type with our professional dermatologist-approved bare-face test.'
      },
      {
        title: 'Building Your Ultimate AM to PM Routine',
        slug: 'building-ultimate-am-pm-routine',
        author: 'Elena Rostova',
        content: 'Your morning skincare routine is about protection (antioxidants, SPF), while your evening routine focuses on repair (peels, heavy creams, retinol). We outline step-by-step how to layer your products, starting from lightest water serums to simplest locking balms.',
        coverImage: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500',
        tags: ['Skincare Routine', 'Layering', 'Beauty Calendar'],
        metaTitle: 'Morning & Night Skincare Layering Guide | Aurelia',
        metaDescription: 'Master product layering. Learn order slots for cleansers, toners, serums, and oils.'
      },
      {
        title: 'The Art of Olfactory Layers: Luxury Fragrances',
        slug: 'art-olfactory-layers-luxury-fragrances',
        author: 'Jean-Louis Marot',
        content: 'Olfactory architecture consists of top notes, heart notes, and base notes. Top notes are volatile citrus oils, followed by dense floral heart notes, and finally warm amber, vanilla, or musk base notes. We review our signature parfum Vespera Night.',
        coverImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500',
        tags: ['Fragrance', 'Editorial', 'Aroma'],
        metaTitle: 'Olfactory Layers & Perfumery Notes | Aurelia',
        metaDescription: 'Understand scent notes. Learn how top notes fade into deep sandalwood bases.'
      },
      {
        title: 'Retinol vs. Botanical Alternatives',
        slug: 'retinol-vs-botanical-alternatives',
        author: 'Dr. Clara Sterling',
        content: 'While retinol remains the gold standard for cell turnover, it can cause severe irritation. Discover Bakuchiol and rosehip extracts, botanical actives that yield similar cellular repair without disrupting sensitive moisture barriers.',
        coverImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
        tags: ['Retinol', 'Bakuchiol', 'Ingredients'],
        metaTitle: 'Retinol Alternatives for Sensitive Skin | Aurelia',
        metaDescription: 'Explore bakuchiol and rosehip botanical alternatives to standard retinol.'
      },
      {
        title: '5 Scalp Exfoliation Tips for Hair Growth',
        slug: 'scalp-exfoliation-tips-hair-growth',
        author: 'Aurelia Hair Lab',
        content: 'Scalp health directly impacts hair growth rate and strength. Excess sebum, dry skin flakes, and styling products block follicles. Weekly scalp scrubs stimulate blood circulation and clarify roots.',
        coverImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500',
        tags: ['Haircare', 'Scalp Care', 'Detox'],
        metaTitle: 'Scalp Care for Strong Hair Growth | Aurelia',
        metaDescription: 'How exfoliating scalp scrubs unclog follicles and boost hair density.'
      },
      {
        title: 'Spring Lip Color Trends: Satin vs. Matte',
        slug: 'spring-lip-color-trends-satin-matte',
        author: 'Vanesa Laurent',
        content: 'This season, makeup trends alternate between high-shine satin and dry, powdery mattes. We break down shade selections, from rich plum tones to nude blush palettes matching our Satin Lip Jewels.',
        coverImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500',
        tags: ['Makeup', 'Lips', 'Trends'],
        metaTitle: 'Spring Lipstick Shades & Textures | Aurelia',
        metaDescription: 'Satin vs matte finishes. Choose the best plum and nude shades for spring.'
      },
      {
        title: 'The Importance of a pH-Balanced Cleanser',
        slug: 'importance-ph-balanced-cleanser',
        author: 'Dr. Clara Sterling',
        content: 'The skin acid mantle has a natural pH of around 5.5. Washing with alkaline bar soaps breaks this mantle, causing acne or eczema flareups. Always opt for pH-balanced gel or milk cleansers.',
        coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
        tags: ['Ingredients', 'Cleanser', 'Sensitive Skin'],
        metaTitle: 'pH Balanced Skincare Guide | Aurelia',
        metaDescription: 'Understand the acid mantle. Why acidic pH levels keep skin hydrated and clear.'
      },
      {
        title: 'Hydration vs. Moisture: What Your Skin Needs',
        slug: 'hydration-vs-moisture-skin-needs',
        author: 'Aurelia Estheticians',
        content: 'Hydration refers to water content within skin layers, whereas moisture is the oil content locking it in. Dehydrated skin lacks water (requires hyaluronic acid); dry skin lacks oil (requires squalane and rich ceramide creams).',
        coverImage: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500',
        tags: ['Hydration', 'Skin Type', 'Moisture'],
        metaTitle: 'Dehydrated vs Dry Skin Difference | Aurelia',
        metaDescription: 'Learn whether your skin requires water humectants or oil occlusives.'
      },
      {
        title: 'Why Mineral Sunscreens Are Best for Sensitive Skin',
        slug: 'mineral-sunscreens-sensitive-skin',
        author: 'Dr. Clara Sterling',
        content: 'Chemical sunscreens (oxybenzone, avobenzone) absorb UV rays and convert them to heat, which can trigger sensitivity or rosacea. Mineral blocks (zinc oxide) act as physical shields, reflecting UV away safely.',
        coverImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
        tags: ['Sunscreen', 'Sensitive Skin', 'SPF'],
        metaTitle: 'Mineral Zinc Sunscreen Benefits | Aurelia',
        metaDescription: 'Discover why physical blocks are safer and calmer for sensitive skin types.'
      }
    ];

    await BlogPost.insertMany(blogPostsData);
    console.log('Seeded 10 Editorial Blog posts.');

    console.log('Database seeding successfully completed.');
  } catch (error) {
    console.error('Seeding script error:', error.message);
    throw error;
  }
};

// Check if run directly
const isDirectRun = import.meta.url.endsWith(process.argv[1]);
if (isDirectRun) {
  dotenv.config();
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aurelia', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async () => {
    await seedData();
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
