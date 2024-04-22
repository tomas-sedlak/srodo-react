// Libraries import
import { lazy } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useDispatch, useSelector } from "react-redux";

// Routes import
import Root from "templates/Root";
const Home = lazy(() => import("routes/home"));
const AI = lazy(() => import("routes/ai"));
const News = lazy(() => import("routes/news"));
const Favourites = lazy(() => import("routes/favourites"));
const User = lazy(() => import("routes/user"));
const Post = lazy(() => import("routes/post"));
const Group = lazy(() => import("routes/group"));
const CreateArticle = lazy(() => import("routes/create_article"));
const CreateQuiz = lazy(() => import("routes/create_quiz"));
const CreateDiscussion = lazy(() => import("routes/create_discussion"));
const CreateGroup = lazy(() => import("routes/create_group"));
const Stats = lazy(() => import("routes/stats"));
const Settings = lazy(() => import("routes/settings"));
const Edit = lazy(() => import("routes/edit"));
const Subject = lazy(() => import("routes/subject"));

import ScrollToTop from "./ScrollToTop";
import LoginModal from "templates/LoginModal";

export default function App() {
    const isAuth = Boolean(useSelector(state => state.token));
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

    return (
        <MantineProvider theme={theme} defaultColorScheme="auto">
            <ModalsProvider>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <ScrollToTop />
                        <LoginModal />
                        <Routes>
                            <Route path="/" element={<Root />}>
                                {/* PUBLIC ROUTES */}
                                <Route index element={<Home />} />
                                <Route path="ai" element={<AI />} />
                                <Route path="novinky" element={<News />} />
                                <Route path="stats" element={<Stats />} />
                                <Route path="predmety/:subject" element={<Subject />} />
                                <Route path="skupiny/:groupId" element={<Group />} />
                                <Route path="skupiny/:groupId/:tab" element={<Group />} />
                                <Route exact path=":username" element={<User />} />
                                <Route exact path=":username/:tab" element={<User />} />
                                <Route exact path=":username/prispevok/:postId" element={<Post />} />

                                {/* PRIVATE ROUTES */}
                                <Route path="oblubene" element={isAuth ? <Favourites /> : <Navigate to="/" />} />
                                <Route path="nastavenia" element={isAuth ? <Settings /> : <Navigate to="/" />} />
                                <Route path="vytvorit" element={!isAuth && <Navigate to="/" />}>
                                    <Route path="clanok" element={<CreateArticle />} />
                                    <Route path="kviz" element={<CreateQuiz />} />
                                    <Route path="diskusia" element={<CreateDiscussion />} />
                                    <Route path="skupina" element={<CreateGroup />} />
                                </Route>

                                {/* SPECIFIC USER ROUTES */}
                                <Route exact path=":username/:postId/upravit" element={isAuth ? <Edit /> : <Navigate to="/" />} />
                                <Route path="statistiky/:postId" element={isAuth ? <Stats /> : <Navigate to="/" />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    )
}