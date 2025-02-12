import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./feature/api/authApi";
import authReducer from "./feature/authSlice";
import taskReducer from "./feature/taskSlice";
import { uploadApi } from "./feature/api/uploadApi";
import { taskApi } from "./feature/api/taskApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
    auth: authReducer,
    task: taskReducer
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(authApi.middleware, uploadApi.middleware, taskApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
