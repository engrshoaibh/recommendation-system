import { createSlice } from "@reduxjs/toolkit";

const initalState = {
    user:{id:1, email: ""}
}

export const todoSlice = createSlice ({
    name: 'user',
    initialState: initalState,
    reducers: {
        login: ()=>{

        },
        logout: ()=>{
            
        }
    }
})