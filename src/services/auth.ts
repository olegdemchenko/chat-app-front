import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserAuthData } from "../types";

type LoginPayload = {
  username: string;
  password: string;
};

type SignupPayload = {
  username: string;
  password: string;
  email: string;
};

type SignupResponse = {
  status: string;
};

type LogoutResponse = {
  status: string;
};

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/auth`,
  }),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    identifyMe: builder.query<UserAuthData, void>({
      query: () => "/me",
    }),
    login: builder.mutation<UserAuthData, LoginPayload>({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupPayload>({
      query: (payload) => ({
        url: "/signup",
        method: "POST",
        body: payload,
      }),
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useIdentifyMeQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = authAPI;
