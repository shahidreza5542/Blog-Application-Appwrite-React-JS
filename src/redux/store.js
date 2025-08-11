import { configureStore } from "@reduxjs/toolkit";
import { AuthSlice } from "./slices/Auth.slice";

export const store =configureStore({
    reducer:{
        [AuthSlice.name]:AuthSlice.reducer
    }
})