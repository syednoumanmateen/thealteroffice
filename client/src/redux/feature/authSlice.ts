import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    user: any;
    isAuthenticated: boolean;
    token: string | null;
}

const initialState: AuthState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") as string) : null,
    isAuthenticated: localStorage.getItem("isAuthenticated") ? JSON.parse(localStorage.getItem("isAuthenticated") as string) : false,
    token: localStorage.getItem("token") ?? null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; token: string }>) => {
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("isAuthenticated", JSON.stringify(true));

            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("isAuthenticated");

            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
