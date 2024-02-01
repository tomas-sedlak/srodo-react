import React from "react";
import ReactDOM from "react-dom/client";

// Libraries import
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";

// Routes import
import Root from "templates/root.jsx";
import Home from "routes/home";
import News from "routes/news";
import Saved from "routes/saved";
import User from "routes/user";
import Post from "routes/post";
import CreateArticle from "routes/create_article";
import CreateQuiz from "routes/create_quiz";
import CreateDiscussion from "routes/create_discussion";

// CSS imports
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "./css/index.css";

// Redux
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const queryClient = new QueryClient();

const theme = createTheme({
    colors: {
        srobarka: ["#ffe5e8", "#ffb3bb", "#ff808e", "#ff4d61", "#ff1a34", "#e6001b", "#b30015", "#80000f", "#4d0009", "#1a0003"]
    },
    primaryColor: "srobarka",
    defaultRadius: "md",
})

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <MantineProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistStore(store)}>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<Root />}>
                                    <Route index element={<Home />} />
                                    <Route path="novinky" element={<News />} />
                                    <Route path="ulozene" element={<Saved />} />
                                    <Route path=":username" element={<User />} />
                                    <Route path=":username/:postId" element={<Post />} />
                                    <Route path="novy">
                                        <Route path="clanok" element={<CreateArticle />} />
                                        <Route path="kviz" element={<CreateQuiz />} />
                                        <Route path="diskusia" element={<CreateDiscussion />} />
                                    </Route>
                                </Route>
                            </Routes>
                        </BrowserRouter>
                    </PersistGate>
                </Provider>
            </QueryClientProvider>
        </MantineProvider>
    </React.StrictMode>
);