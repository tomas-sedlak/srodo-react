// Libraries import
import { lazy, useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useDispatch, useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setUser } from "state";
import axios from "axios";

// Routes import
import Root from "templates/Root";
import Login from "routes/login";
import ResetPassword from "routes/reset_password";
import Register from "routes/register";
import ImagesPreview from "templates/ImagesPreview";
const Home = lazy(() => import("routes/home"));
const AI = lazy(() => import("routes/ai"));
const QuizRoute = lazy(() => import("routes/quiz")); {/* Route for quiz testing */ }
const Quiz = lazy(() => import("routes/quiz"))
const Explore = lazy(() => import("routes/explore"));
const Favourites = lazy(() => import("routes/favourites"));
const User = lazy(() => import("routes/user"));
const Post = lazy(() => import("routes/post"));
const Group = lazy(() => import("routes/group"));
const CreateGroup = lazy(() => import("routes/create_group"));
const EditGroup = lazy(() => import("routes/edit_goup"));
const EditProfile = lazy(() => import("routes/edit_profile"));
const Settings = lazy(() => import("routes/settings"));
const Verify = lazy(() => import("routes/verify"));
const Invite = lazy(() => import("routes/invite"));

import ScrollToTop from "./ScrollToTop";
import LoginModal from "templates/LoginModal";
import ResetPasswordConfirm from "routes/reset_password_confirm";

import ReactGa from "react-ga4";
ReactGa.initialize("G-F26LVP1SF6")

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
        cursorType: "pointer",
    })

    const fetchUser = async () => {
        if (!userId) return
        const response = await axios.get(`/api/user?userId=${userId}`)
        dispatch(setUser({ user: response.data }))
    }

    useEffect(() => {
        fetchUser()
        ReactGa.send({ hitType: "pageview", page: window.location.pathname });
    }, [])

    return (
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <ModalsProvider>
                <Notifications />
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
                                    <Route path="quiz" element={<QuizRoute />} /> {/* Added route to quiz fro testing */}
                                    <Route path="kviz/:quizId" element={<Quiz />} />
                                    <Route path="preskumat" element={<Explore />} />
                                    <Route path="skupiny/:groupId" element={<Group />} />
                                    <Route path="skupiny/:groupId/:tab" element={<Group />} />
                                    <Route exact path=":username" element={<User />} />
                                    <Route exact path=":username/:tab" element={<User />} />
                                    <Route exact path=":username/prispevok/:postId" element={<Post />} />

                                    {/* PRIVATE ROUTES */}
                                    <Route path="ucet/upravit" element={isAuth ? <EditProfile /> : <Navigate to="/" replace />} />
                                    <Route path="ucet/nastavenia" element={isAuth ? <Settings /> : <Navigate to="/" replace />} />
                                    <Route path="ucet/oblubene" element={isAuth ? <Favourites /> : <Navigate to="/" replace />} />
                                    <Route path="skupiny/:groupId/upravit" element={isAuth ? <EditGroup /> : <Navigate to="/" replace />} />
                                    <Route path="vytvorit" element={!isAuth && <Navigate to="/" replace />}>
                                        <Route path="skupina" element={<CreateGroup />} />
                                    </Route>

                                    <Route path="overenie-emailu/:verifyEmailToken" element={<Verify />} />
                                    <Route path="pozvanka/:privateKey" element={isAuth ? <Invite /> : <Navigate to="/prihlasenie" replace />} />
                                </Route>

                                <Route path="prihlasenie" element={<Login />} />
                                <Route path="resetovat-heslo" element={<ResetPassword />} />
                                <Route path="resetovat-heslo/:token" element={<ResetPasswordConfirm />} />
                                <Route path="registracia" element={<Register />} />
                                <Route path=":username/prispevok/:postId/media" element={<ImagesPreview />} />
                            </Routes>
                        </BrowserRouter>
                    </GoogleOAuthProvider>
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    )
}