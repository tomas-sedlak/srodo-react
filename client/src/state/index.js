import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    token: null,
    loginModal: false,
    imagesModal: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.userId = action.payload.userId;
            state.token = action.payload.token;
        },
        setUserId: (state, action) => {
            state.userId = action.payload.userId;
        },
        setLogout: (state) => {
            state.userId = null;
            state.token = null;
        },
        setLoginModal: (state, action) => {
            state.loginModal = action.payload;
        }
    },
});

export const { setLogin, setUser, setLogout, setLoginModal } = authSlice.actions;
export default authSlice.reducer;