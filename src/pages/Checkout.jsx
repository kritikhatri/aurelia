import React, { useState } from 'react';
import useCartStore from '../features/useCartStore';
import api from '../services/api';
import { CreditCard, Truck, ShieldCheck, ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const { cartItems, coupon, clearCart, getTotals } = useCartStore();
  const { subtotal, discount, total } = getTotals();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiry: '12/28',
    cvv: '123'
  });

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
      toast.error('Please complete all shipping address fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/orders/checkout', {
        items: cartItems,
        shippingAddress,
        couponCode: coupon?.code || ''
      });

      toast.success('Order processed successfully!');
      clearCart();
      // Redirect to the success URL returned by the backend (Stripe or Simulator redirect)
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error processing payment session');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center space-y-4">
        <ShoppingCart className="w-12 h-12 mx-auto text-plum/30 dark:text-ivory/30 animate-pulse" />
        <h2 className="font-serif italic text-lg text-plum/50 dark:text-ivory/50">Your atelier cart is empty.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      <div className="border-b border-plum/5 dark:border-ivory/5 pb-4">
        <h1 className="text-3xl font-serif text-plum dark:text-ivory">Secured Atelier Checkout</h1>
        <p className="text-xs uppercase tracking-widest text-plum/50 dark:text-ivory/50 mt-1 font-semibold">
          Enter your delivery details and finalize order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Columns - Form */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleCheckoutSubmit} className="space-y-6">
            
            {/* Shipping section */}
            <div className="space-y-4">
              <h3 className="font-serif font-semibold text-base flex items-center gap-2 border-b border-plum/10 pb-2">
                <Truck className="w-4 h-4 text-gold" /> 1. Shipping Address
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingAddress.street}
                    onChange={handleInputChange}
                    required
                    placeholder="123 LUXURY BLVD"
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">City</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                    placeholder="NEW YORK"
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">State / Region</label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    required
                    placeholder="NY"
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Postal / Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={handleInputChange}
                    required
                    placeholder="10001"
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required
                    placeholder="UNITED STATES"
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Payment section */}
            <div className="space-y-4">
              <h3 className="font-serif font-semibold text-base flex items-center gap-2 border-b border-plum/10 pb-2">
                <CreditCard className="w-4 h-4 text-gold" /> 2. Payment Details
              </h3>
              
              <div className="bg-plum/5 dark:bg-obsidian-light/30 p-4 border border-plum/5 text-xs text-plum/70 dark:text-ivory/70 space-y-1">
                <p className="font-bold text-gold">Stripe Test Card Enabled</p>
                <p className="font-light">If Stripe Secret Key is missing, the transaction will automatically run in **Simulation Mode** and credit orders directly.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">Card Number</label>
                  <input
                    type="text"
                    value={paymentDetails.cardNumber}
                    disabled
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-plum/60 dark:text-ivory/60">CVV</label>
                  <input
                    type="text"
                    value={paymentDetails.cvv}
                    disabled
                    className="w-full bg-transparent border-b border-plum/20 focus:border-gold py-1 text-xs outline-none text-plum dark:text-ivory"
                  />
                </div>
              </div>
            </div>

            {/* Submission CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-plum flex items-center justify-center gap-2 py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" /> Processing Secure Payment...
                </>
              ) : (
                <>
                  Authorize Payment & Place Order (${total.toFixed(2)})
                </>
              )}
            </button>

          </form>

        </div>

        {/* Right Column - Order summary */}
        <div className="glass-card p-6 border border-plum/10 dark:border-ivory/10 space-y-6">
          <h3 className="font-serif font-semibold text-base border-b border-plum/10 pb-2">Order Summary</h3>
          
          {/* Items */}
          <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div key={`${item.product}-${item.variant}`} className="flex gap-3 text-xs justify-between">
                <div>
                  <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                  <p className="text-[10px] text-plum/50 dark:text-ivory/50">Qty: {item.qty} {item.variant && `| Variant: ${item.variant}`}</p>
                </div>
                <span className="font-bold shrink-0">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Pricing splits */}
          <div className="border-t border-plum/10 dark:border-ivory/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-plum/50 dark:text-ivory/50">Subtotal</span>
              <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Discount Applied</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-plum/50 dark:text-ivory/50">Atelier Courier Delivery</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">Complimentary</span>
            </div>
            <div className="flex justify-between border-t border-plum/5 dark:border-ivory/5 pt-2 text-sm font-bold">
              <span>Grand Total</span>
              <span className="text-gold">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-plum/5 pt-4 text-[10px] uppercase font-bold text-plum/50 dark:text-ivory/50">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>256-bit SSL encrypted transaction</span>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
