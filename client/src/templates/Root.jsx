import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader, Text } from "@mantine/core";
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
                <Suspense fallback={
                    <div className="loader-center">
                        <Loader />
                        <Text>Už to bude 😉</Text>
                    </div>
                }>
                    <Outlet />
                </Suspense>
            </div>

            <Aside />
        </main>
    )
}