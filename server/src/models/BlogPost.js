import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  author: { type: String, required: true, default: 'Aurelia Editorial' },
  content: { type: String, required: true }, // Rich text or markdown content
  coverImage: { type: String, default: '' },
  tags: [{ type: String }],
  publishedAt: { type: Date, default: Date.now },
  metaTitle: { type: String, default: '' },
  metaDescription: { type: String, default: '' }
}, {
  timestamps: true
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;
