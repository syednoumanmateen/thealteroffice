import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const logsApi = createApi({
    reducerPath: "logsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/logs",
        prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        fetchAllLogs: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "GET"
            }),
        }),
    }),
});

export const { useFetchAllLogsMutation } = logsApi;
