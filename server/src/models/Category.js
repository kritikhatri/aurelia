import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  image: { type: String, default: '' },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
