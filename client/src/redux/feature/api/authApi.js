import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/auth" }),
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
        }),
        login: builder.mutation({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData,
            }),
        }),
        loginUserById: builder.mutation({
            query: (access_token) => ({
                url: "/logedInUser",
                method: "POST",
                body: { access_token },
                headers: {
                    Authorization: `Bearer ${access_token}`, // Attaching token for authorization
                },
            }),
        }),
        googleLogin: builder.mutation({
            query: (access_token) => ({
                url: "/google-login",
                method: "POST",
                body: { access_token },
            }),
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useGoogleLoginMutation } = authApi;
