import CommunityPost from '../models/CommunityPost.js';

// Get Community Posts
export const getCommunityPosts = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category, status: 'approved' } : { status: 'approved' };

  try {
    const posts = await CommunityPost.find(filter)
      .sort({ createdAt: -1 })
      .populate('user', 'name avatar');
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving posts', error: error.message });
  }
};

// Create Community Post
export const createCommunityPost = async (req, res) => {
  const { title, content, category, images } = req.body;

  try {
    const post = await CommunityPost.create({
      user: req.user._id,
      userName: req.user.name,
      title,
      content,
      category: category || 'general',
      images: images || [],
      status: 'approved'
    });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};

// Toggle Like
export const likeCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

// Comment on Post
export const addCommentToPost = async (req, res) => {
  const { content } = req.body;

  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = {
      user: req.user._id,
      userName: req.user.name,
      content
    };

    post.comments.push(comment);
    await post.save();
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Flag Post for Moderation
export const flagCommunityPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.status = 'flagged';
    await post.save();
    return res.json({ message: 'Post flagged for moderation review', post });
  } catch (error) {
    return res.status(500).json({ message: 'Error flagging post', error: error.message });
  }
};
