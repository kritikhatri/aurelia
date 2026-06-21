import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Get Products (with Search, Pagination, Filtering, and Sorting)
export const getProducts = async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  // Search keyword (matches text indexes)
  const keyword = req.query.keyword
    ? {
        $text: { $search: req.query.keyword }
      }
    : {};

  // Filtering criteria
  let categoryFilter = {};
  if (req.query.category) {
    if (/^[0-9a-fA-F]{24}$/.test(req.query.category)) {
      categoryFilter = { category: req.query.category };
    } else {
      const foundCat = await Category.findOne({ slug: req.query.category });
      if (foundCat) {
        categoryFilter = { category: foundCat._id };
      } else {
        categoryFilter = { category: null };
      }
    }
  }
  const subCategoryFilter = req.query.subCategory ? { subCategory: req.query.subCategory } : {};
  
  let skinTypeFilter = {};
  if (req.query.skinType) {
    skinTypeFilter = { skinTypeSuitability: req.query.skinType };
  }

  let priceFilter = {};
  if (req.query.minPrice || req.query.maxPrice) {
    priceFilter = {
      price: {
        $gte: Number(req.query.minPrice) || 0,
        $lte: Number(req.query.maxPrice) || Infinity
      }
    };
  }

  let ratingFilter = {};
  if (req.query.rating) {
    ratingFilter = { ratingsAvg: { $gte: Number(req.query.rating) } };
  }

  // Combine query filters
  const query = {
    ...keyword,
    ...categoryFilter,
    ...subCategoryFilter,
    ...skinTypeFilter,
    ...priceFilter,
    ...ratingFilter
  };

  // Sorting
  let sortOption = {};
  if (req.query.sortBy === 'price_asc') {
    sortOption = { price: 1 };
  } else if (req.query.sortBy === 'price_desc') {
    sortOption = { price: -1 };
  } else if (req.query.sortBy === 'rating') {
    sortOption = { ratingsAvg: -1 };
  } else if (req.query.sortBy === 'newest') {
    sortOption = { createdAt: -1 };
  } else {
    // Default sort by relevance if search is present, else newest
    sortOption = req.query.keyword ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
  }

  try {
    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    return res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error retrieving products', error: error.message });
  }
};

// Get Product by Slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category subCategory');
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Personalized Recommendations
export const getRecommendations = async (req, res) => {
  const { skinType } = req.query; // If logged in, passed from user profile, otherwise quiz result

  try {
    let recommendations = [];
    if (skinType && skinType !== '') {
      // Find products suited to their skin type
      recommendations = await Product.find({ skinTypeSuitability: skinType })
        .sort({ ratingsAvg: -1, isFeatured: -1 })
        .limit(6);
    } else {
      // Fallback to featured/bestselling
      recommendations = await Product.find({ isFeatured: true })
        .sort({ ratingsAvg: -1 })
        .limit(6);
    }
    return res.json(recommendations);
  } catch (error) {
    return res.status(500).json({ message: 'Server error recommendations', error: error.message });
  }
};

// Get Categories and Subcategories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parentCategory: null });
    
    // Fetch with subcategories nested
    const fullCategories = await Promise.all(
      categories.map(async (cat) => {
        const subs = await Category.find({ parentCategory: cat._id });
        return {
          ...cat.toObject(),
          subcategories: subs
        };
      })
    );
    
    return res.json(fullCategories);
  } catch (error) {
    return res.status(500).json({ message: 'Server error categories', error: error.message });
  }
};
