import { createSlice } from "@reduxjs/toolkit";

export const AuthSlice = createSlice({
    initialState:{
        user:null
    },
    name:'AuthSlice',
    reducers:{
        setUser(state,action){
            state.user = action.payload
        },
        removeUser(state){
            state.user = null
        }
    }
})
export const {setUser,removeUser} = AuthSlice.actions

export const AuthSlicePath = (store)=>store.AuthSlice.user