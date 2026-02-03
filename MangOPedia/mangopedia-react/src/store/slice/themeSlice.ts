import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utility/constants';

const getInitialState = {
  theme: localStorage.getItem(STORAGE_KEYS.THEME) || 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: getInitialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      document.body.setAttribute('data-bs-theme', state.theme);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
