import { createSlice } from '@reduxjs/toolkit';

type destination = {
  name: string;
  days: number;
  fact: string;
};

export type destState = {
  destinations: destination[];
  destinationSelected: destination | null;
};

const initialState: destState = {
  destinations: [
    {
      name: 'Hong Kong',
      days: 7,
      fact: "World's longest covered escalator",
    },
    {
      name: 'Japan',
      days: 10,
      fact: 'Japan is mostly mountains',
    },
    {
      name: 'New Zealand',
      days: 14,
      fact: 'Last country in the world to be inhabited by humans',
    },
  ],
  destinationSelected: null,
};

const desintationSlice = createSlice({
  name: 'destination',
  initialState: initialState,
  reducers: {
    destinationClicked: (state, action) => {
      state.destinationSelected = action.payload;
    },
  },
});

export const destinationReducer = desintationSlice.reducer;
export const { destinationClicked } = desintationSlice.actions;
