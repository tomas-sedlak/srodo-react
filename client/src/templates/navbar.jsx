import { Badge, Box, Button, Text } from '@mantine/core';
import { IconPlus, IconHome, IconNews, IconBookmark, IconRobot, IconSchool } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import Profile from "../templates/profile";

const menu = [
    {
        label: "Domov",
        link: "/",
        emoji: <IconHome />
    },
    {
        label: "Šrodo AI",
        link: "/ai",
        emoji: <IconRobot />,
        badge: "Nové!"
    },
    {
        label: "Predmety",
        link: "/tags",
        emoji: <IconSchool />
    },
    {
        label: "Novinky",
        link: "/tags",
        emoji: <IconNews />
    },
    {
        label: "Uložené",
        link: "/tags",
        emoji: <IconBookmark />
    },
]

export default function Navbar() {
    return (
        <header className="navbar">
            <nav>
                {/* Srodo logo */}
                <Text fw={700} fz="lg" ml="sm" mb="lg">Šrodo</Text>

                {/* Menu items */}
                {menu.map((item) => <MenuItem item={item} />)}

                {/* Navbar buttons */}
                <Link to="/new">
                    <Button
                        mt="lg"
                        px="sm"
                        size="md"
                        leftSection={<IconPlus />}
                        justify="flex-start"
                        fullWidth
                    >
                        Nový príspevok
                    </Button>
                </Link>
                
                {/* <Button
                    mt="lg"
                    px="sm"
                    size="md"
                    justify="flex-start"
                    fullWidth
                >
                    Zaregistrovať sa
                </Button>
                <Button
                    mt={8}
                    px="sm"
                    size="md"
                    justify="flex-start"
                    variant="outline"
                    fullWidth
                >
                    Prihlásiť sa
                </Button> */}
            </nav>

            <Profile user={{username: "Admin", displayName: "Name"}} />
        </header>
    )
}

function MenuItem({ item }) {
    return (
        <Link key={item.label} to={item.link}>
            <Button
                px="sm"
                leftSection={item.emoji}
                rightSection={item.badge && <Badge variant="light">{item.badge}</Badge>}
                variant="subtle"
                color="dark"
                size="md"
                justify="flex-start"
                fullWidth
            >
                {item.label}
            </Button>
        </Link>
    )
}