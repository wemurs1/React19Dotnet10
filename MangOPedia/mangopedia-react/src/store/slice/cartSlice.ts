import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utility/constants';

export type CartItemType = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type CartTotalsType = {
  totalItems: number;
  totalAmount: number;
};

export type CartState = {
  items: CartItemType[];
  totalItems: number;
  totalAmount: number;
};

const getStoredCart = () => {
  try {
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    const parsed: CartItemType[] = cart ? JSON.parse(cart) : [];
    return Array.isArray(parsed) ? parsed : ([] as CartItemType[]);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.CART);
    return [] as CartItemType[];
  }
};

const saveCart = (items: CartItemType[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart', error);
  }
};

const calculateTotals = (items: CartItemType[] = []) => {
  let totalItems = 0;
  let totalAmount = 0;

  for (const item of items) {
    totalItems += item.quantity;
    totalAmount += item.price * item.quantity;
  }
  const returnedValue = { totalItems, totalAmount } as CartTotalsType;
  return returnedValue;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getStoredCart() || ([] as CartItemType[]),
    ...calculateTotals(getStoredCart()),
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload as CartItemType;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        state.items.push({
          ...newItem,
          quantity: newItem.quantity || 1,
        });
      }
      Object.assign(state, calculateTotals(state.items));
      saveCart(state.items);
    },

    removeFromCart: (state, action) => {
      const id = action.payload as number;
      state.items = state.items.filter((item) => item.id !== id);
      Object.assign(state, calculateTotals(state.items));
      saveCart(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload as CartItemType;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const item = state.items.find((item) => item.id === id);
        if (item) item.quantity = quantity;
      }
      Object.assign(state, calculateTotals(state.items));
      saveCart(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
      localStorage.removeItem(STORAGE_KEYS.CART);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
