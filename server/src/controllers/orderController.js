import Order from '../models/Order.js';
import User from '../models/User.js';
import Coupon from '../models/Coupon.js';
import ReferralLog from '../models/ReferralLog.js';
import stripeInstance from '../config/stripe.js';

// Apply Coupon Endpoint
export const applyCoupon = async (req, res) => {
  const { code, spendAmount } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check expiry
    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Check usage limits
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check min spend
    if (spendAmount < coupon.minSpend) {
      return res.status(400).json({ message: `Minimum spend of $${coupon.minSpend} required` });
    }

    return res.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error applying coupon', error: error.message });
  }
};

// Create Checkout Session (Stripe OR Simulator fallback)
export const createCheckoutSession = async (req, res) => {
  const { items, shippingAddress, couponCode } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total amount
    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.qty;
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon && new Date() <= new Date(coupon.expiryDate)) {
        if (coupon.type === 'percentage') {
          discount = (subtotal * coupon.value) / 100;
        } else {
          discount = coupon.value;
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discount);
    const rewardPointsEarned = Math.floor(totalAmount);

    // 1. STRIPE ACTIVE MODE
    if (stripeInstance) {
      try {
        const lineItems = items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              metadata: { variant: item.variant }
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.qty,
        }));

        // Build Stripe session
        const session = await stripeInstance.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/cart`,
          client_reference_id: userId.toString(),
          metadata: {
            shippingAddress: JSON.stringify(shippingAddress),
            couponCode: couponCode || '',
            rewardPointsEarned: rewardPointsEarned.toString(),
            totalAmount: totalAmount.toString(),
            items: JSON.stringify(items.map(i => ({ product: i.product, name: i.name, qty: i.qty, price: i.price, variant: i.variant })))
          }
        });

        return res.json({ id: session.id, url: session.url, mode: 'stripe' });
      } catch (stripeErr) {
        console.error('Stripe SDK creation error, falling back to Simulator:', stripeErr);
      }
    }

    // 2. SIMULATOR FALLBACK MODE
    // Generate order in database directly as Paid
    const order = await Order.create({
      user: userId,
      items: items.map(i => ({
        product: i.product,
        name: i.name,
        qty: i.qty,
        price: i.price,
        variant: i.variant
      })),
      shippingAddress,
      paymentStatus: 'paid',
      paymentIntentId: 'simulated_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      orderStatus: 'pending',
      totalAmount,
      couponApplied: couponCode || '',
      rewardPointsEarned
    });

    // Credit reward points to user
    user.rewardPoints += rewardPointsEarned;
    await user.save();

    // Increment coupon usage
    if (couponCode) {
      await Coupon.findOneAndUpdate({ code: couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
    }

    // Process Referral Program credit
    const referral = await ReferralLog.findOne({ referee: userId, status: 'pending' });
    if (referral) {
      // Allocate 50 points to both referrer and referee
      const referrerUser = await User.findById(referral.referrer);
      if (referrerUser) {
        referrerUser.rewardPoints += 50;
        await referrerUser.save();
      }

      user.rewardPoints += 50;
      await user.save();

      referral.status = 'completed';
      referral.rewardIssued = true;
      await referral.save();
    }

    return res.json({ 
      id: order._id, 
      url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/success?orderId=${order._id}&simulated=true`, 
      mode: 'simulator' 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing checkout session', error: error.message });
  }
};

// Retrieve Logged in User's Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Retrieve Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Access check: only user themselves or admin can see it
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
};

// Stripe Webhook handler for async events
export const stripeWebhook = async (req, res) => {
  let event = req.body;
  // Note: Standard webhook verification with stripeInstance.webhooks.constructEvent goes here in production
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    const metadata = session.metadata;

    try {
      const items = JSON.parse(metadata.items);
      const shippingAddress = JSON.parse(metadata.shippingAddress);
      
      const order = await Order.create({
        user: userId,
        items,
        shippingAddress,
        paymentStatus: 'paid',
        paymentIntentId: session.payment_intent || session.id,
        orderStatus: 'pending',
        totalAmount: Number(metadata.totalAmount),
        couponApplied: metadata.couponCode,
        rewardPointsEarned: Number(metadata.rewardPointsEarned)
      });

      // Award points
      const user = await User.findById(userId);
      if (user) {
        user.rewardPoints += Number(metadata.rewardPointsEarned);
        await user.save();

        // Check referrals
        const referral = await ReferralLog.findOne({ referee: userId, status: 'pending' });
        if (referral) {
          const referrerUser = await User.findById(referral.referrer);
          if (referrerUser) {
            referrerUser.rewardPoints += 50;
            await referrerUser.save();
          }
          user.rewardPoints += 50;
          await user.save();

          referral.status = 'completed';
          referral.rewardIssued = true;
          await referral.save();
        }
      }

      if (metadata.couponCode) {
        await Coupon.findOneAndUpdate({ code: metadata.couponCode.toUpperCase() }, { $inc: { usedCount: 1 } });
      }

      console.log(`Stripe payment recorded for Order ${order._id}`);
    } catch (err) {
      console.error('Stripe Webhook DB sync error:', err.message);
      return res.status(500).send(`Webhook DB Error: ${err.message}`);
    }
  }

  return res.json({ received: true });
};
