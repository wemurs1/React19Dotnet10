import { createSlice } from '@reduxjs/toolkit';

const initialState = { count: 10 };

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    decrementMultiplier: (state, action) => {
      const multiplier = action.payload;
      state.count -= multiplier;
    },
    incrementMultiplier: (state, action) => {
      const multiplier = action.payload;
      state.count += multiplier;
    },
    resetCounterSlice: (state) => {
      state.count = 10;
    },
  },
});

export const { increment, decrement, decrementMultiplier, incrementMultiplier, resetCounterSlice } =
  counterSlice.actions;
export const counterReducer = counterSlice.reducer;
