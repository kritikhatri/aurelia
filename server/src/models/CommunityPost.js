import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true }
}, {
  timestamps: true
});

const communityPostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  category: { 
    type: String, 
    enum: ['skincare', 'makeup', 'haircare', 'general'], 
    default: 'general' 
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  status: { 
    type: String, 
    enum: ['approved', 'flagged', 'removed'], 
    default: 'approved' 
  }
}, {
  timestamps: true
});

const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export default CommunityPost;
