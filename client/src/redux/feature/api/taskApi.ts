import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApi = createApi({
    reducerPath: "taskApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/task",
        prepareHeaders: (headers) => {
            headers.set("authorization", `Bearer ${localStorage.getItem("token")}`);
            return headers;
        },
    }),
    endpoints: (builder) => ({
        fetchAllTasks: builder.mutation({
            query: () => ({
                url: "/",
                method: "GET"
            }),
        }),
        fetchTaskById: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "GET"
            }),
        }),
        createTask: builder.mutation({
            query: (taskData: any) => ({
                url: "/",
                method: "POST",
                body: taskData,
            }),
        }),
        updateTaskById: builder.mutation({
            query: ({ id, updateData }: { id: string; updateData: any }) => ({
                url: `/${id}`,
                method: "PUT",
                body: updateData,
            }),
        }),
        updateMultipleTasks: builder.mutation({
            query: (updateData) => ({
                url: "/multi/taskIds/update",
                method: "POST",
                body: updateData,
            }),
        }),
        deleteTask: builder.mutation({
            query: (id: string) => ({
                url: `/${id}`,
                method: "DELETE",
            }),
        }),
        deleteMultipleTasks: builder.mutation({
            query: (taskIds) => ({
                url: "/multi/taskIds/delete",
                method: "POST",
                body: { taskIds },
            }),
        }),
    }),
});

export const { useFetchAllTasksMutation, useFetchTaskByIdMutation, useCreateTaskMutation, useUpdateTaskByIdMutation, useUpdateMultipleTasksMutation, useDeleteTaskMutation, useDeleteMultipleTasksMutation } = taskApi;
