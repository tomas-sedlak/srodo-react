import { Outlet } from "react-router-dom";
import Header from "templates/Header";
import Aside from "templates/Aside";
import Navbar from "templates/Navbar";

export default function Root() {
    return (
        <main className="home-wrapper">
            <Header />

            <nav className="navbar">
                <Navbar />
            </nav>

            <div className="content">
                <Outlet />
            </div>

            <Aside />
        </main>
    )
}