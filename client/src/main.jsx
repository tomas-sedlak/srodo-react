import React from "react";
import ReactDOM from "react-dom/client";

// Libraries import
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";

// Routes import
import Root from "./routes/root.jsx";
import Home from "./routes/home.jsx";
import User, {loader as userLoader} from "./routes/user.jsx";
import News from "./routes/news.jsx";
import Saves from "./routes/saves.jsx";
import Article, {loader as articleLoader} from "./routes/article.jsx";
import CreateArticle from "./routes/create-article.jsx";
import CreateQuiz from "./routes/create-quiz.jsx";
import CreateDiscussion from "./routes/create-discussion.jsx";

// CSS imports
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import "./css/index.css";

// import "dotenv/config.js";
// dotenv.config();

// Heroku.com

const queryClient = new QueryClient();

const theme = createTheme({
    colors: {
        srobarka: ["#ffe5e8", "#ffb3bb", "#ff808e", "#ff4d61", "#ff1a34", "#e6001b", "#b30015", "#80000f", "#4d0009", "#1a0003"]
    },
    primaryColor: "srobarka",
    defaultRadius: "md",
})

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "novinky",
                element: <News />,
            },
            {
                path: "ulozene",
                element: <Saves />,
            },
            {
                path: ":username",
                element: <User />,
                loader: userLoader,
            },
            {
                path: ":username/:article",
                element: <Article />,
                loader: articleLoader,
            },
            {
                path: "novy",
                children: [
                    {
                        path: "clanok",
                        element: <CreateArticle />,
                    },
                    {
                        path: "kviz",
                        element: <CreateQuiz />,
                    },
                    {
                        path: "diskusia",
                        element: <CreateDiscussion />,
                    }
                ],
            }
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
            <RouterProvider router={router} />
        </MantineProvider>
    </QueryClientProvider>
  </React.StrictMode>
);