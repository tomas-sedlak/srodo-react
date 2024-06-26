// Libraries import
import { lazy, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setUser } from "state";
import axios from "axios";

// Routes import
import Root from "templates/Root";
import Login from "routes/login";
const Home = lazy(() => import("routes/home"));
const AI = lazy(() => import("routes/ai"));
const Explore = lazy(() => import("routes/explore"));
const Favourites = lazy(() => import("routes/favourites"));
const User = lazy(() => import("routes/user"));
const Post = lazy(() => import("routes/post"));
const Group = lazy(() => import("routes/group"));
const CreateGroup = lazy(() => import("routes/create_group"));
const EditGroup = lazy(() => import("routes/edit_goup"));
const Settings = lazy(() => import("routes/settings"));

import ScrollToTop from "./ScrollToTop";
import LoginModal from "templates/LoginModal";

export default function App() {
    const isAuth = Boolean(useSelector(state => state.token));
    const userId = useSelector(state => state.user?._id);
    const dispatch = useDispatch();
    const queryClient = new QueryClient();
    const theme = createTheme({
        colors: {
            srobarka: [
                "#ffeaf3",
                "#fdd4e1",
                "#f4a7bf",
                "#ec779c",
                "#e64f7e",
                "#e3356b",
                "#e22762",
                "#c91a52",
                "#b41149",
                "#9f003e"
            ],
        },
        primaryColor: "srobarka",
        defaultRadius: "md",
    })

    const fetchUser = async () => {
        if (!userId) return
        const response = await axios.get(`/api/user?userId=${userId}`)
        dispatch(setUser({ user: response.data }))
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <ModalsProvider>
                <QueryClientProvider client={queryClient}>
                    <GoogleOAuthProvider clientId="1025882831817-q56up75r66liinfsm368qdbolepva3fr.apps.googleusercontent.com">
                        <BrowserRouter>
                            <ScrollToTop />
                            <LoginModal />
                            <Routes>
                                <Route path="/" element={<Root />}>
                                    {/* PUBLIC ROUTES */}
                                    <Route index element={<Home />} />
                                    <Route path="ai" element={<AI />} />
                                    <Route path="preskumat" element={<Explore />} />
                                    <Route path="skupiny/:groupId" element={<Group />} />
                                    <Route path="skupiny/:groupId/:tab" element={<Group />} />
                                    <Route exact path=":username" element={<User />} />
                                    <Route exact path=":username/:tab" element={<User />} />
                                    <Route exact path=":username/prispevok/:postId" element={<Post />} />

                                    {/* PRIVATE ROUTES */}
                                    <Route path="oblubene" element={isAuth ? <Favourites /> : <Navigate to="/" />} />
                                    <Route path="nastavenia" element={isAuth ? <Settings /> : <Navigate to="/" />} />
                                    <Route path="skupiny/:groupId/upravit" element={isAuth ? <EditGroup /> : <Navigate to="/" />} />
                                    <Route path="vytvorit" element={!isAuth && <Navigate to="/" />}>
                                        <Route path="skupina" element={<CreateGroup />} />
                                    </Route>
                                </Route>

                                <Route path="prihlasenie" element={<Login />} />
                            </Routes>
                        </BrowserRouter>
                    </GoogleOAuthProvider>
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    )
}