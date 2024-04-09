import { createSlice } from "@reduxjs/toolkit";
import { authAPI } from "../../services/auth";
import { type User } from "../../types";
import type { RootState } from "..";

type AuthState = {
  info: User | null;
  token: string | null;
};

const initialState: AuthState = {
  info: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
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

export const selectCurrentUser = (state: RootState) => state.user.info;
export const selectCurrentUserToken = (state: RootState) => state.user.token;
