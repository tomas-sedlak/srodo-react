import React from "react";
import ReactDOM from "react-dom/client";
import '@mantine/core/styles.css';
import "./index.css";
import { MantineProvider } from "@mantine/core"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.jsx"
import Home from "./routes/home.jsx"
import User, {loader as userLoader} from "./routes/user.jsx"
import Tag, {loader as tagLoader} from "./routes/tag.jsx"
import Article from "./routes/article.jsx"

// Heroku.com

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: ":username",
                element: <User />,
                loader: userLoader
            },
            {
                path: "article",
                element: <Article />
            },
            {
                path: "tags/:tag",
                element: <Tag />,
                loader: tagLoader
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider>
        <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);