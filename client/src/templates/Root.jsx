import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader, Text } from "@mantine/core";
import Aside from "templates/Aside";
import Navbar from "templates/Navbar";
import MobileNavbar from "templates/MobileNavbar";

export default function Root() {
    return (
        <>
            <div className="page-wrapper">
                <nav className="navbar">
                    <Navbar />
                </nav>

                <main>
                    <Suspense fallback={
                        <div className="loader-center">
                            <Loader />
                            <Text>Už to bude 😉</Text>
                        </div>
                    }>
                        <Outlet />
                    </Suspense>
                </main>

                <aside className="aside">
                    <Aside />
                </aside>

            </div>

            <nav className="mobile-navbar">
                <MobileNavbar />
            </nav>
        </>
    )
}