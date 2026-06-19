import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Coupon from '../models/Coupon.js';
import BlogPost from '../models/BlogPost.js';
import CommunityPost from '../models/CommunityPost.js';

// Dashboard Analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ paymentStatus: 'paid' });

    // Calculate total revenue
    const revenueStats = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueStats.length > 0 ? Math.round(revenueStats[0].totalRevenue * 100) / 100 : 0;

    // Monthly orders & revenue metrics (for charts)
    const orderHistory = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 15 } // Last 15 active days
    ]);

    const formattedHistory = orderHistory.map(item => ({
      date: item._id,
      revenue: Math.round(item.revenue * 100) / 100,
      orders: item.count
    }));

    // Bestselling products (aggregating order items)
    const bestSellers = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          quantitySold: { $sum: '$items.qty' },
          totalSales: { $sum: { $multiply: ['$items.price', '$items.qty'] } }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: 5 }
    ]);

    return res.json({
      summary: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      },
      salesHistory: formattedHistory,
      bestSellers
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching admin analytics', error: error.message });
  }
};

// --- Product CRUD ---
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json({ message: 'Product deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting product', error: error.message });
  }
};

// --- Order Admin Management ---
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.orderStatus = orderStatus;
    await order.save();
    return res.json(order);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating order status', error: error.message });
  }
};

// --- Customer Management ---
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-passwordHash');
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};

// --- Coupon CRUD ---
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return res.json(coupons);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching coupons' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    return res.status(201).json(coupon);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating coupon', error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    return res.json({ message: 'Coupon deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting coupon' });
  }
};

// --- Forum Community Moderation ---
export const getFlaggedPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find({ status: 'flagged' }).populate('user', 'name email');
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching flagged posts' });
  }
};

export const moderatePost = async (req, res) => {
  const { action } = req.body; // 'approve' or 'remove'
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (action === 'approve') {
      post.status = 'approved';
      await post.save();
    } else {
      post.status = 'removed';
      await post.save();
    }

    return res.json({ message: `Post ${action}d successfully` });
  } catch (error) {
    return res.status(400).json({ message: 'Moderation action failed' });
  }
};

// --- Blog CRUD ---
export const createBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({ message: 'Error creating blog post', error: error.message });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ message: 'Error updating blog post' });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    return res.json({ message: 'Blog post deleted' });
  } catch (error) {
    return res.status(400).json({ message: 'Error deleting blog post' });
  }
};
