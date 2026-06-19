import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
  coupon: null, // { code, type, value }
  
  addItem: (product, variant = '', qty = 1) => {
    const items = [...get().cartItems];
    const existingIndex = items.findIndex(
      (item) => item.product === product._id && item.variant === variant
    );

    if (existingIndex > -1) {
      items[existingIndex].qty += qty;
    } else {
      items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        variant,
        qty
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(items));
    set({ cartItems: items });
  },

  removeItem: (productId, variant = '') => {
    const filtered = get().cartItems.filter(
      (item) => !(item.product === productId && item.variant === variant)
    );
    localStorage.setItem('cartItems', JSON.stringify(filtered));
    set({ cartItems: filtered });
  },

  updateQty: (productId, variant = '', qty) => {
    const items = get().cartItems.map((item) => {
      if (item.product === productId && item.variant === variant) {
        return { ...item, qty: Math.max(1, qty) };
      }
      return item;
    });
    localStorage.setItem('cartItems', JSON.stringify(items));
    set({ cartItems: items });
  },

  clearCart: () => {
    localStorage.removeItem('cartItems');
    set({ cartItems: [], coupon: null });
  },

  applyCoupon: (coupon) => {
    set({ coupon });
  },

  removeCoupon: () => {
    set({ coupon: null });
  },

  getTotals: () => {
    const items = get().cartItems;
    const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
    const coupon = get().coupon;
    
    let discount = 0;
    if (coupon) {
      if (coupon.type === 'percentage') {
        discount = (subtotal * coupon.value) / 100;
      } else {
        discount = coupon.value;
      }
    }

    const total = Math.max(0, subtotal - discount);
    return { subtotal, discount, total };
  }
}));

export default useCartStore;
