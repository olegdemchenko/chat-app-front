import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserAuthData } from "../types";

type LoginPayload = {
  username: string;
  password: string;
};

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `/api/auth`,
  }),
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
  }),
});

export const { useIdentifyMeQuery, useLoginMutation } = authAPI;
