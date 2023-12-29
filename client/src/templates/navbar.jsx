import { Badge, Button, Group, Text, Menu } from '@mantine/core';
import { IconPlus, IconHome, IconNews, IconBookmark, IconRobot, IconSchool, IconChevronRight, IconPencilPlus, IconMessageCircleQuestion, IconCopyCheck } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import Profile from "../templates/profile";

const menu = [
    {
        label: "Domov",
        link: "/",
        emoji: <IconHome stroke={1.75} />
    },
    {
        label: "Šrodo AI",
        link: "/ai",
        emoji: <IconRobot stroke={1.75} />,
        badge: "Nové!"
    },
    {
        label: "Predmety",
        link: "/predmety",
        emoji: <IconSchool stroke={1.75} />
    },
    {
        label: "Novinky",
        link: "/novinky",
        emoji: <IconNews stroke={1.75} />
    },
    {
        label: "Uložené",
        link: "/ulozene",
        emoji: <IconBookmark stroke={1.75} />
    },
]

export default function Navbar() {
    return (
        <header className="navbar">
            <nav>
                {/* Srodo logo */}
                <Text fw={700} size="xl" ml="sm" mb="lg" style={{ lineHeight: 1 }}>Šrodo</Text>

                {/* Menu items */}
                {menu.map((item) => <MenuItem item={item} />)}

                {/* Navbar buttons */}
                <Menu width={240}>
                    <Menu.Target>
                        <Button
                            mt="lg"
                            px="sm"
                            size="md"
                            leftSection={<IconPlus stroke={1.75} />}
                            justify="flex-start"
                            fullWidth
                        >
                            Vytvoriť
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Link to="/new/article">
                            <Menu.Item leftSection={<IconPencilPlus stroke={1.5} />}>
                                Článok
                            </Menu.Item>
                        </Link>

                        <Link to="/new/quiz">
                            <Menu.Item leftSection={<IconCopyCheck stroke={1.5} />}>
                                Kvíz
                            </Menu.Item>
                        </Link>

                        <Link to="/new/discussion">
                            <Menu.Item leftSection={<IconMessageCircleQuestion stroke={1.5} />}>
                                Diskusia
                            </Menu.Item>
                        </Link>
                    </Menu.Dropdown>
                </Menu>
                
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
            
            <Link to="nastavenia">
                <Button
                    px="sm"
                    variant="subtle"
                    color="dark"
                    size="md"
                    fullWidth
                >
                    <Group justify="space-between" w="100%">
                        <Profile user={{username: "Admin", displayName: "Name"}} />
                        <IconChevronRight stroke={1.75} />
                    </Group>
                </Button>
            </Link>
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