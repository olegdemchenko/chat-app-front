import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Profile } from "types";

type SignInPayload = {
  username: string;
  password: string;
};

type SignUpPayload = {
  username: string;
  password: string;
  email: string;
};

type SignInResponse = {
  access_token: string;
};

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_HTTP_HOST}/auth`,
  }),
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    profile: builder.query<Profile, string>({
      query: (token: string) => ({
        url: "/profile",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    signIn: builder.mutation<SignInResponse, SignInPayload>({
      query: (payload) => ({
        url: "/signin",
        method: "POST",
        body: payload,
      }),
    }),
    signUp: builder.mutation<SignInResponse, SignUpPayload>({
      query: (payload) => ({
        url: "/signup",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useProfileQuery, useSignInMutation, useSignUpMutation } =
  authAPI;
