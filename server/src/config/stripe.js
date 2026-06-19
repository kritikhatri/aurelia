import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripeInstance = null;

if (stripeSecretKey) {
  stripeInstance = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
  });
  console.log('Stripe client initialized.');
} else {
  console.warn('STRIPE_SECRET_KEY is missing. Stripe Simulator Mode will be active.');
}

export default stripeInstance;
