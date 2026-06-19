import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, ShoppingBag, Users, Settings, Tag, ShieldAlert, BookOpen, Trash2, Plus, Edit, ShieldCheck, Home } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [adminTab, setAdminTab] = useState('analytics');

  // Product form modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', price: '', stock: '', description: '', brand: 'Aurelia', category: '', compareAtPrice: ''
  });

  // Coupon form modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '', type: 'percentage', value: '', minSpend: '0', expiryDate: ''
  });

  // 1. Fetch Analytics
  const { data: analytics, isLoading: isAnalLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics');
      return res.data;
    }
  });

  // 2. Fetch Products
  const { data: prodData } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => {
      const res = await api.get('/products?page=1');
      return res.data.products || [];
    }
  });

  // 3. Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ['categoriesList'],
    queryFn: async () => {
      const res = await api.get('/products/categories');
      return res.data;
    }
  });

  // 4. Fetch Flagged Posts
  const { data: flaggedPosts } = useQuery({
    queryKey: ['flaggedPosts'],
    queryFn: async () => {
      const res = await api.get('/admin/flagged-posts');
      return res.data || [];
    }
  });

  // 5. Fetch Coupons
  const { data: coupons } = useQuery({
    queryKey: ['adminCoupons'],
    queryFn: async () => {
      const res = await api.get('/admin/coupons');
      return res.data || [];
    }
  });

  // Product Mutations
  const createProductMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/products', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      setIsProductModalOpen(false);
      queryClient.invalidateQueries(['adminProducts']);
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const res = await api.put(`/admin/products/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      setIsProductModalOpen(false);
      setEditingProduct(null);
      queryClient.invalidateQueries(['adminProducts']);
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries(['adminProducts']);
    }
  });

  // Coupon Mutations
  const createCouponMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await api.post('/admin/coupons', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Coupon created successfully');
      setIsCouponModalOpen(false);
      queryClient.invalidateQueries(['adminCoupons']);
    }
  });

  const deleteCouponMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/admin/coupons/${id}`);
    },
    onSuccess: () => {
      toast.success('Coupon deleted');
      queryClient.invalidateQueries(['adminCoupons']);
    }
  });

  // Moderation Mutation
  const moderatePostMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      const res = await api.put(`/admin/flagged-posts/${id}/moderate`, { action });
      return res.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Post ${variables.action}ed successfully`);
      queryClient.invalidateQueries(['flaggedPosts']);
    }
  });

  // Product Form submits
  const handleProductSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      slug: prod.slug,
      price: prod.price.toString(),
      stock: prod.stock.toString(),
      description: prod.description,
      brand: prod.brand,
      category: prod.category?._id || prod.category || '',
      compareAtPrice: prod.compareAtPrice?.toString() || ''
    });
    setIsProductModalOpen(true);
  };

  const handleCreateProductClick = () => {
    setEditingProduct(null);
    setProductForm({
      name: '', slug: '', price: '', stock: '', description: '', brand: 'Aurelia', category: categories?.[0]?._id || '', compareAtPrice: ''
    });
    setIsProductModalOpen(true);
  };

  // Coupon Submit
  const handleCouponSubmit = (e) => {
    e.preventDefault();
    createCouponMutation.mutate({
      ...couponForm,
      value: Number(couponForm.value),
      minSpend: Number(couponForm.minSpend)
    });
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-obsidian text-plum dark:text-ivory px-4 py-8 relative transition-colors">
      
      {/* Admin header */}
      <div className="flex justify-between items-center border-b border-plum/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-serif text-plum dark:text-ivory">Atelier Admin Console</h1>
          <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-1 font-semibold">
            Supervise sales analytics, product catalog items, and community flags
          </p>
        </div>
        
        {/* Floating return to home */}
        <Link to="/" className="text-xs uppercase font-bold tracking-widest text-plum/60 dark:text-ivory/60 hover:text-gold flex items-center gap-1.5 focus:outline-none">
          <Home className="w-4 h-4" /> Exit Console
        </Link>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation panel */}
        <nav className="flex flex-col gap-1 border-r border-plum/10 dark:border-ivory/10 pr-4">
          {[
            { id: 'analytics', label: 'Console Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products CRUD', icon: ShoppingBag },
            { id: 'coupons', label: 'Coupon Registry', icon: Tag },
            { id: 'moderation', label: 'Forum Moderation', icon: ShieldAlert }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase font-bold tracking-widest text-left transition-all ${
                  adminTab === tab.id
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
          
          {/* 1. ANALYTICS DASHBOARD */}
          {adminTab === 'analytics' && (
            <div className="space-y-8">
              
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: `$${analytics?.summary?.totalRevenue || '3,450.00'}`, icon: Tag },
                  { label: 'Total Orders', value: analytics?.summary?.totalOrders || '74', icon: ShoppingBag },
                  { label: 'Registered Customers', value: analytics?.summary?.totalUsers || '32', icon: Users },
                  { label: 'Catalog Products', value: analytics?.summary?.totalProducts || '30', icon: LayoutDashboard }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="glass-card p-6 border border-plum/10 flex flex-col justify-between gap-2">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-plum/50 dark:text-ivory/50 flex items-center gap-1">
                        <Icon className="w-3.5 h-3.5 text-gold" /> {stat.label}
                      </span>
                      <p className="text-2xl font-serif font-bold text-plum dark:text-ivory">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Chart Timeline */}
              <div className="glass-card p-6 border border-plum/10 space-y-4">
                <h3 className="font-serif font-semibold text-base border-b border-plum/5 pb-2">Sales Revenue Timeline</h3>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics?.salesHistory || [
                        { date: '2026-06-10', revenue: 200 },
                        { date: '2026-06-11', revenue: 450 },
                        { date: '2026-06-12', revenue: 300 },
                        { date: '2026-06-13', revenue: 800 },
                        { date: '2026-06-14', revenue: 600 },
                        { date: '2026-06-15', revenue: 1100 }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="date" stroke="#D4AF37" fontSize={10} tickLine={false} />
                      <YAxis stroke="#D4AF37" fontSize={10} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#D4AF37', color: '#FAF9F6', fontSize: 10 }} />
                      <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={0.15} fill="#D4AF37" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bestselling items */}
              <div className="glass-card p-6 border border-plum/10 space-y-4">
                <h3 className="font-serif font-semibold text-base border-b border-plum/5 pb-2">Bestselling Formulations</h3>
                
                <div className="space-y-3">
                  {(analytics?.bestSellers || [
                    { name: 'Golden Hour Peptide Elixir', quantitySold: 18, totalSales: 1404 },
                    { name: 'Velvet Hydra-Infusion Cream', quantitySold: 12, totalSales: 768 },
                    { name: 'Vespera Night Eau de Parfum', quantitySold: 8, totalSales: 920 }
                  ]).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs border-b border-plum/5 pb-2">
                      <div>
                        <p className="font-bold uppercase">{item.name}</p>
                        <span className="text-[10px] text-plum/50 dark:text-ivory/50">Sold: {item.quantitySold} units</span>
                      </div>
                      <span className="font-serif font-bold text-gold">${item.totalSales}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. PRODUCT CRUD PANEL */}
          {adminTab === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-plum/10 pb-2">
                <h3 className="font-serif font-semibold text-lg">Product Inventory Catalog</h3>
                <button onClick={handleCreateProductClick} className="btn-gold text-[10px] py-1.5 px-4 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Product
                </button>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-plum/15 dark:border-ivory/15 uppercase font-bold tracking-wider text-[10px] text-plum/50 dark:text-ivory/50">
                      <th className="py-3 px-4">Formula</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prodData?.map((prod) => (
                      <tr key={prod._id} className="border-b border-plum/5 dark:border-ivory/5 hover:bg-plum/5 dark:hover:bg-ivory/5 transition-all">
                        <td className="py-3 px-4 font-bold uppercase">{prod.name}</td>
                        <td className="py-3 px-4 font-semibold">${prod.price}</td>
                        <td className="py-3 px-4">{prod.stock} items</td>
                        <td className="py-3 px-4 flex justify-center gap-2">
                          <button onClick={() => handleEditProductClick(prod)} className="p-1.5 hover:text-gold" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteProductMutation.mutate(prod._id)} className="p-1.5 hover:text-red-500" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. COUPON REGISTRY PANEL */}
          {adminTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-plum/10 pb-2">
                <h3 className="font-serif font-semibold text-lg">Active Promotion Coupons</h3>
                <button onClick={() => setIsCouponModalOpen(true)} className="btn-gold text-[10px] py-1.5 px-4 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Create Coupon
                </button>
              </div>

              {/* Coupons List */}
              <div className="space-y-4">
                {coupons.map((c) => (
                  <div key={c._id} className="glass-card p-4 border border-plum/5 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="font-bold text-gold text-sm tracking-widest">{c.code}</span>
                      <p className="text-[10px] text-plum/50 dark:text-ivory/50">
                        Type: {c.type} | Value: {c.value}{c.type === 'percentage' ? '%' : '$'} | Min Spend: ${c.minSpend}
                      </p>
                      <p className="text-[9px] text-plum/40 dark:text-ivory/40">Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => deleteCouponMutation.mutate(c._id)} className="p-1.5 hover:text-red-500">
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. MODERATION PANEL */}
          {adminTab === 'moderation' && (
            <div className="space-y-6">
              <h3 className="font-serif font-semibold text-lg border-b border-plum/10 pb-2">Flagged Conversations Queue</h3>

              {flaggedPosts?.length === 0 ? (
                <p className="italic text-xs text-plum/50">No forum discussions flagged for moderation review.</p>
              ) : (
                <div className="space-y-4">
                  {flaggedPosts.map((post) => (
                    <div key={post._id} className="glass-card p-6 border border-red-200/20 bg-red-500/5 space-y-4 text-xs">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-red-500 border border-red-500/30 px-2 py-0.5 rounded-none">{post.category}</span>
                        <h4 className="font-serif font-bold text-sm mt-2">{post.title}</h4>
                        <p className="text-[10px] text-plum/50 mt-1">Author: {post.userName} | Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
                      </div>
                      <p className="font-light leading-relaxed whitespace-pre-line bg-white/40 dark:bg-black/40 p-3">{post.content}</p>

                      <div className="flex gap-4">
                        <button
                          onClick={() => moderatePostMutation.mutate({ id: post._id, action: 'approve' })}
                          className="btn-plum text-[10px] py-1.5 px-4 flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" /> Approve & Keep Post
                        </button>
                        <button
                          onClick={() => moderatePostMutation.mutate({ id: post._id, action: 'remove' })}
                          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-[10px] py-1.5 px-4 flex items-center gap-1.5 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Post
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* PRODUCT CRUD MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsProductModalOpen(false)} />
          <div className="w-full max-w-xl glass-modal p-6 shadow-2xl relative z-10 border border-plum/10 space-y-4 max-h-[85vh] overflow-y-auto">
            <h3 className="font-serif font-semibold text-lg border-b border-plum/5 pb-2">
              {editingProduct ? 'Update Product Catalog' : 'Create Product Catalog'}
            </h3>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Formula Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Slug URL</label>
                  <input
                    type="text"
                    required
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Price ($)</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-plum dark:text-ivory"
                  >
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id} className="bg-ivory dark:bg-obsidian">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Compare Price ($)</label>
                  <input
                    type="number"
                    value={productForm.compareAtPrice}
                    onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })}
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Description details</label>
                <textarea
                  rows="3"
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-transparent border border-plum/20 focus:border-gold p-3 text-plum dark:text-ivory"
                />
              </div>

              <button type="submit" className="w-full btn-plum py-2.5">
                {editingProduct ? 'Save Catalog Product' : 'Create Catalog Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COUPON CRUD MODAL */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsCouponModalOpen(false)} />
          <div className="w-full max-w-sm glass-modal p-6 shadow-2xl relative z-10 border border-plum/10 space-y-4">
            <h3 className="font-serif font-semibold text-lg border-b border-plum/5 pb-2">Create Promotion Coupon</h3>

            <form onSubmit={handleCouponSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory uppercase"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Type</label>
                <select
                  value={couponForm.type}
                  onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value })}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-plum dark:text-ivory"
                >
                  <option value="percentage" className="bg-ivory dark:bg-obsidian">Percentage Discount (%)</option>
                  <option value="fixed" className="bg-ivory dark:bg-obsidian">Fixed Amount Discount ($)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Discount Value</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 15 for 15% or 20 for $20"
                  value={couponForm.value}
                  onChange={(e) => setCouponForm({ ...couponForm, value: e.target.value })}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Min Spend ($)</label>
                <input
                  type="number"
                  value={couponForm.minSpend}
                  onChange={(e) => setCouponForm({ ...couponForm, minSpend: e.target.value })}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-plum/60 dark:text-ivory/60">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={couponForm.expiryDate}
                  onChange={(e) => setCouponForm({ ...couponForm, expiryDate: e.target.value })}
                  className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 outline-none text-plum dark:text-ivory"
                />
              </div>

              <button type="submit" className="w-full btn-plum py-2.5">
                Create Coupon
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
