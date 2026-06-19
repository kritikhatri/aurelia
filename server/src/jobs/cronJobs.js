import cron from 'node-cron';
import Subscription from '../models/Subscription.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const initCronJobs = () => {
  // Run daily at midnight to simulate subscription renewals
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily subscription renewal job...');
    try {
      const now = new Date();
      // Find active subscriptions past renewal date
      const activeSubscriptions = await Subscription.find({
        status: 'active',
        nextRenewalDate: { $lte: now }
      });

      console.log(`Found ${activeSubscriptions.length} subscriptions to renew.`);

      for (const sub of activeSubscriptions) {
        const user = await User.findById(sub.user);
        if (!user) continue;

        // Pricing based on tier
        let amount = 29.99;
        if (sub.boxTier === 'Signature') amount = 49.99;
        if (sub.boxTier === 'Prestige') amount = 89.99;

        // Create order
        await Order.create({
          user: sub.user,
          items: [
            {
              product: null, // Box order
              name: `Aurelia ${sub.boxTier} Subscription Box`,
              qty: 1,
              price: amount,
              variant: sub.frequency
            }
          ],
          shippingAddress: user.addresses.find(a => a.isDefault) || {
            street: '123 Luxury Way',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          paymentStatus: 'paid',
          paymentIntentId: 'sub_renew_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
          orderStatus: 'pending',
          totalAmount: amount,
          rewardPointsEarned: Math.floor(amount)
        });

        // Award points
        user.rewardPoints += Math.floor(amount);
        await user.save();

        // Push renewal date
        const newRenewalDate = new Date();
        newRenewalDate.setMonth(newRenewalDate.getMonth() + 1);
        sub.nextRenewalDate = newRenewalDate;
        await sub.save();

        console.log(`Successfully renewed subscription for User ${user.email}`);
      }
    } catch (error) {
      console.error('Subscription cron job error:', error.message);
    }
  });

  console.log('Cron jobs scheduled successfully.');
};
