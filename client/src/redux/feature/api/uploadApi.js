import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadApi = createApi({
    reducerPath: "uploadApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/upload",
        prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        singleUpload: builder.mutation({
            query: (uploadData) => ({
                url: "/upload-single",
                method: "POST",
                body: uploadData,
            }),
        }),
        multipleUpload: builder.mutation({
            query: (uploadData) => ({
                url: "/upload-multiple",
                method: "POST",
                body: uploadData,
            }),
        }),
        fetchImages: builder.mutation({
            query: (ids) => ({
                url: "/upload-fetch",
                method: "POST",
                body: ids,
            }),
        }),
    }),
});

export const { useSingleUploadMutation, useMultipleUploadMutation, useFetchImagesMutation } = uploadApi;
