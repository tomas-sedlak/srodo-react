import React from "react";
import ReactDOM from "react-dom/client";
import '@mantine/core/styles.css';
import "./index.css";
import '@mantine/tiptap/styles.css';
import { MantineProvider, createTheme } from "@mantine/core"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/root.jsx"
import Home from "./routes/home.jsx"
import User, {loader as userLoader} from "./routes/user.jsx"
import Tag, {loader as tagLoader} from "./routes/tag.jsx"
import Article from "./routes/article.jsx"
import Create from "./routes/create.jsx"

// Heroku.com

const theme = createTheme({
    colors: {
        srobarka: ["#ffe5e8", "#ffb3bb", "#ff808e", "#ff4d61", "#ff1a34", "#e6001b", "#b30015", "#80000f", "#4d0009", "#1a0003"]
    },
    primaryColor: "srobarka"
})

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
            },
        ]
    },
    {
        path: "new",
        element: <Create />
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
        <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>
);