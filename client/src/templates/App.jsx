// Libraries import
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import { useSelector } from "react-redux";

// Routes import
import Root from "templates/Root";
import Home from "routes/home";
import News from "routes/news";
import Saved from "routes/saved";
import User from "routes/user";
import Post from "routes/post";
import CreateArticle from "routes/create_article";
import CreateQuiz from "routes/create_quiz";
import CreateDiscussion from "routes/create_discussion";

import LoginModal from "templates/LoginModal";
import React from "react";

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
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <LoginModal />
                    <Routes>
                        <Route path="/" element={<Root />}>
                            {/* PUBLIC ROUTES */}
                            <Route index element={<Home />} />
                            <Route path="novinky" element={<News />} />
                            <Route path=":username" element={<User />} />
                            <Route path=":username/:postId" element={<Post />} />

                            {/* PRIVATE ROUTES */}
                            <Route path="ulozene" element={isAuth ? <Saved /> : <Navigate to="/" />} />
                            <Route path="novy" element={!isAuth && <Navigate to="/" />}>
                                <Route path="clanok" element={<CreateArticle />} />
                                <Route path="kviz" element={<CreateQuiz />} />
                                <Route path="diskusia" element={<CreateDiscussion />} />
                            </Route>
                        </Route>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </MantineProvider>
    )
}