import { configureStore } from "@reduxjs/toolkit";
import { authAPI } from "../services/auth";
import chatAPI from "../services/chat";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [chatAPI.reducerPath]: chatAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware, chatAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
