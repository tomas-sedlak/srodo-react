// Libraries import
import { lazy } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { useSelector } from "react-redux";

// Routes import
import Root from "templates/Root";
const Home = lazy(() => import("routes/home"));
const News = lazy(() => import("routes/news"));
const Saved = lazy(() => import("routes/saved"));
const User = lazy(() => import("routes/user"));
const Post = lazy(() => import("routes/post"));
const CreateArticle = lazy(() => import("routes/create_article"));
const CreateQuiz = lazy(() => import("routes/create_quiz"));
const CreateDiscussion = lazy(() => import("routes/create_discussion"));
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
            srobarka: ["#ffe5e8", "#ffb3bb", "#ff808e", "#ff4d61", "#ff1a34", "#e6001b", "#b30015", "#80000f", "#4d0009", "#1a0003"]
        },
        primaryColor: "srobarka",
        defaultRadius: "md",
    })

    return (
        <MantineProvider theme={theme}>
            <ModalsProvider>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <ScrollToTop />
                        <LoginModal />
                        <Routes>
                            <Route path="/" element={<Root />}>
                                {/* PUBLIC ROUTES */}
                                <Route index element={<Home />} />
                                <Route path="novinky" element={<News />} />
                                <Route path="stats" element={<Stats />} />
                                <Route path="predmet/:subject" element={<Subject />} />
                                <Route path=":username" element={<User />} />
                                <Route path=":username/:postId" element={<Post />} />

                                {/* PRIVATE ROUTES */}
                                <Route path="ulozene" element={isAuth ? <Saved /> : <Navigate to="/" />} />
                                <Route path="nastavenia" element={isAuth ? <Settings /> : <Navigate to="/" />} />
                                <Route path="vytvorit" element={!isAuth && <Navigate to="/" />}>
                                    <Route path="clanok" element={<CreateArticle />} />
                                    <Route path="kviz" element={<CreateQuiz />} />
                                    <Route path="diskusia" element={<CreateDiscussion />} />
                                </Route>

                                {/* SPECIFIC USER ROUTES */}
                                <Route path=":username/:postId/upravit" element={isAuth ? <Edit /> : <Navigate to="/" />} />
                                <Route path="statistiky/:postId" element={isAuth ? <Stats /> : <Navigate to="/" />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </ModalsProvider>
        </MantineProvider>
    )
}