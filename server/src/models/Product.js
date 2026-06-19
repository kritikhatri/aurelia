import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "01 Light", "50ml", "100ml"
  type: { type: String, enum: ['shade', 'size'], required: true },
  price: { type: Number }, // Optional override price
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  brand: { type: String, default: 'Aurelia' },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: null },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  ingredients: [{ type: String }],
  skinTypeSuitability: [{ type: String, enum: ['Dry', 'Oily', 'Combo', 'Sensitive', 'Normal'] }],
  tags: [{ type: String }],
  ratingsAvg: { type: Number, default: 5 },
  ratingsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  variants: [variantSchema],
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' }
}, {
  timestamps: true
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
