import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  images: [{ type: String }],
  verifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Update product rating counts/average whenever a review is saved
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const stats = await Review.aggregate([
    { $match: { product: this.product } },
    { $group: { _id: '$product', ratingsCount: { $sum: 1 }, ratingsAvg: { $avg: '$rating' } } }
  ]);
  
  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(this.product, {
      ratingsAvg: Math.round(stats[0].ratingsAvg * 10) / 10,
      ratingsCount: stats[0].ratingsCount
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
