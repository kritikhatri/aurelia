import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  variant: { type: String, default: '' } // e.g. shade name or size
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentIntentId: { type: String, default: '' },
  orderStatus: { 
    type: String, 
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  totalAmount: { type: Number, required: true },
  couponApplied: { type: String, default: '' },
  rewardPointsEarned: { type: Number, default: 0 }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
