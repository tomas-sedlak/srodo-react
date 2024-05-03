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
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setUser: (state, action) => {
            state.user = action.payload.user;
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

export const { setLogin, setUser, setLogout, setLoginModal } = authSlice.actions;
export default authSlice.reducer;