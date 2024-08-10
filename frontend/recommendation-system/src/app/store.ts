import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";

// Create the store with the userReducer
export const store = configureStore({
    reducer: {
        user: userReducer
    }
});

// Define RootState and AppDispatch types for use in components and thunks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
