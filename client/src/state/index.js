import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    loginModal: false,
    imagesModal: false,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setLoginModal: (state, action) => {
            state.loginModal = action.payload;
        }
    },
});

export const { setLogin, setLogout, setLoginModal } = authSlice.actions;
export default authSlice.reducer;