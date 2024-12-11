import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authAPI } from "../services/auth";
import { type User } from "../types";
import type { RootState } from ".";

type AuthState = {
  info: User | null;
  token: string | null;
  userId: string | null;
};

const initialState: AuthState = {
  info: null,
  token: null,
  userId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    clearUserId: (state) => {
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authAPI.endpoints.identifyMe.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.info = payload.user;
      },
    );
    builder.addMatcher(
      authAPI.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.token = payload.token;
        state.info = payload.user;
      },
    );
  },
});

export default userSlice.reducer;

export const { saveUserId, clearUserId } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.info;
export const selectCurrentUserToken = (state: RootState) => state.user.token;
export const selectCurrentUserId = (state: RootState) => state.user.userId;
