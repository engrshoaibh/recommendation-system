import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types for your state
interface User {
    id?: string;
    email?: string;
}

interface UserState {
    user: User;
}

// Define the initial state with type
const initialState: UserState = {
    user: {}
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ id: string; email: string }>) => {
            const { id, email } = action.payload;
            state.user = { id, email };
            localStorage.setItem('user', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = {};
            localStorage.removeItem('user');
        }
    }
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
