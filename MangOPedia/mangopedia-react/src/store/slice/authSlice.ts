import { getUserInfoFromToken, isTokenExpired, type DecodedJWT } from '../../utility/jwtUtility';
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEYS = {
  TOKEN: 'token-mango',
  USER: 'user-mango',
};

export type AuthState = {
  user: DecodedJWT | null;
  token: string | null;
  isAuthenticated: boolean;
};

const getInitialAuthState = () => {
  const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

  // clear invalid token
  if (
    !storedToken ||
    storedToken === 'undefined' ||
    storedToken === null ||
    isTokenExpired(storedToken)
  ) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { user: null, token: null, isAuthenticated: false } as AuthState;
  }

  let user: DecodedJWT | null = null;
  if (storedUser && storedUser !== 'undefined' && storedUser !== null) {
    try {
      user = JSON.parse(storedUser);
    } catch {
      // If use data is corrupted, extract from token
      user = getUserInfoFromToken(storedToken);
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }
    }
  }
  return { user, token: storedToken, isAuthenticated: !!storedToken && !!user } as AuthState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { ...getInitialAuthState() },
  reducers: {
    setAuth: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = !!(user && token);
      if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },
    logout: (state) => {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
