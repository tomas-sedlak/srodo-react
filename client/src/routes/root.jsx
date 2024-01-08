import { Outlet } from "react-router-dom";
import Header from "../templates/header";
import Aside from "../templates/aside";
import Navbar from "../templates/navbar";

export default function Root() {
    return (
        <main className="home-wrapper">
            <Header />
            <Navbar />
            <Outlet />
            <Aside />
        </main>
    )
}