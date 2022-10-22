import {createSlice, configureStore} from "@reduxjs/toolkit";
import profileReducers from "./profileReducer";

const initialProfileState = {
    userId: null,
    name: null,
    profileImageUrl: null,
    role: null,
    unreadNotifications: null
}

const profileSlice = createSlice({
    name: "ProfileState",
    initialState: initialProfileState,
    reducers: profileReducers
})

const store = configureStore({
    reducer: {
        profileSlice: profileSlice.reducer
    }
})

export default store;
export const profileActions  = profileSlice.actions;