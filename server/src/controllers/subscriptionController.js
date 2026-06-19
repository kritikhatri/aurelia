import Subscription from '../models/Subscription.js';

// Get user subscription
export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    return res.json(subscription);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching subscription', error: error.message });
  }
};

// Create or update subscription
export const createOrUpdateSubscription = async (req, res) => {
  const { boxTier, frequency, selectedPreferences } = req.body;

  try {
    let subscription = await Subscription.findOne({ user: req.user._id });
    const nextRenewal = new Date();
    nextRenewal.setMonth(nextRenewal.getMonth() + 1);

    if (subscription) {
      subscription.boxTier = boxTier;
      subscription.frequency = frequency;
      subscription.selectedPreferences = selectedPreferences;
      subscription.status = 'active';
      subscription.nextRenewalDate = nextRenewal;
      await subscription.save();
    } else {
      subscription = await Subscription.create({
        user: req.user._id,
        boxTier,
        frequency,
        selectedPreferences,
        nextRenewalDate: nextRenewal,
        status: 'active'
      });
    }

    return res.json(subscription);
  } catch (error) {
    return res.status(500).json({ message: 'Error processing subscription', error: error.message });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    subscription.status = 'cancelled';
    await subscription.save();
    return res.json(subscription);
  } catch (error) {
    return res.status(500).json({ message: 'Error cancelling subscription', error: error.message });
  }
};
