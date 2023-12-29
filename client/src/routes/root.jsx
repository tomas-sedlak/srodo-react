import { Outlet } from "react-router-dom";
import { Box, Text } from '@mantine/core';
import Aside from "../templates/aside";
import Navbar from "../templates/navbar";

export default function Root() {
    return (
        <main className="home-wrapper">
            <Navbar />

            <Box>
                <Outlet />
                <Text ta="center" py="lg">Dostal si sa az na koniec stranky 🥳</Text>
            </Box>

            <Aside />
        </main>
    )
}