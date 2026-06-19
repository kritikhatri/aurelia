import BlogPost from '../models/BlogPost.js';

// Get all blog posts
export const getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find({}).sort({ publishedAt: -1 });
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
};

// Get single blog post by slug
export const getBlogPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (post) {
      return res.json(post);
    } else {
      return res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching blog post', error: error.message });
  }
};
