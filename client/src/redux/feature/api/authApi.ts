import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
    endpoints: (builder: any) => ({
        register: builder.mutation({
            query: (userData: any) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (userData: any) => ({
                url: "/login",
                method: "POST",
                body: userData,
            }),
        }),
        googleLogin: builder.mutation({
            query: (credential: any) => ({
                url: "/google-login",
                method: "POST",
                body: { credential },
            }),
        }),
        googleUserInfo: builder.mutation({
            query: (access_token: any) => ({
                url: "/google-user-info",
                method: "POST",
                body: { access_token },
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useGoogleLoginMutation, useGoogleUserInfoMutation } = authApi;
