import { createSlice } from "@reduxjs/toolkit";

export interface TaskState {
    refresh: boolean
}

const initialState: TaskState = {
    refresh: false
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setRefresh: (state, action) => {
            state.refresh = action.payload
        }
    },
});

export const { setRefresh } = taskSlice.actions;
export default taskSlice.reducer;
