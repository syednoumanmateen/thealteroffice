import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./feature/api/authApi";
import { uploadApi } from "./feature/api/uploadApi";
import { taskApi } from "./feature/api/taskApi";
import authReducer from "./feature/authSlice";
import loadingReducer from "./feature/defaultSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    [authApi.reducerPath]: authApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, uploadApi.middleware, taskApi.middleware),
});
