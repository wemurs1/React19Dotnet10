import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './slice/counterSlice';
import { destinationReducer } from './slice/destinationSlice';

export const store = configureStore({
  reducer: {
    counterStore: counterReducer,
    destinationStore: destinationReducer
  },
});

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']