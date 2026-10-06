import { configureStore } from '@reduxjs/toolkit';
import assignmentsReducer from '../features/assignments/assignmentsSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware();
    // Only enable redux-logger in development environment
    if (import.meta.env.DEV) {
      return middlewares.concat(logger);
    }
    return middlewares;
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
