import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY_CART = 'cart-mango';

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
    const cart = localStorage.getItem(STORAGE_KEY_CART);
    const parsed: CartItemType[] = cart ? JSON.parse(cart) : [];
    return Array.isArray(parsed) ? parsed : ([] as CartItemType[]);
  } catch {
    localStorage.removeItem(STORAGE_KEY_CART);
    return [] as CartItemType[];
  }
};

const saveCart = (items: CartItemType[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(items));
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
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;
