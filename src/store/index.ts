import { configureStore } from "@reduxjs/toolkit";
import { authAPI } from "../services/auth";
import userReducer from "./userSlice";
import roomsReducer from "./roomsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    [authAPI.reducerPath]: authAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
