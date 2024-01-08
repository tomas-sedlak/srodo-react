import { useDisclosure } from '@mantine/hooks';
import { Badge, Button, Collapse, Text, ScrollArea } from '@mantine/core';
import { IconPlus, IconHome, IconNews, IconBookmark, IconRobot, IconChevronUp, IconChevronDown, IconPencilPlus, IconMessageCircleQuestion, IconCopyCheck } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import Profile from "../templates/profile";

const menu = [
    {
        label: "Domov",
        link: "/",
        leftSection: <IconHome stroke={1.25} />
    },
    {
        label: "Šrodo AI",
        link: "/ai",
        leftSection: <IconRobot stroke={1.25} />,
        badge: "Nové!"
    },
    {
        label: "Novinky",
        link: "/novinky",
        leftSection: <IconNews stroke={1.25} />
    },
    {
        label: "Uložené",
        link: "/ulozene",
        leftSection: <IconBookmark stroke={1.25} />
    },
]

const categories = [
    {
        label: "Matematika",
        link: "/",
        leftSection: "📈"
    },
    {
        label: "Informatika",
        link: "/",
        leftSection: "💻"
    },
    {
        label: "Jazyky",
        link: "/",
        leftSection: "💬"
    },
    {
        label: "Biológia",
        link: "/",
        leftSection: "🧬"
    },
    {
        label: "Chémia",
        link: "/",
        leftSection: "🧪"
    },
    {
        label: "Fyzika",
        link: "/",
        leftSection: "⚡"
    },
    {
        label: "Geografia",
        link: "/",
        leftSection: "🌍"
    },
    {
        label: "Umenie",
        link: "/",
        leftSection: "🎨"
    },
    {
        label: "Šport",
        link: "/",
        leftSection: "💪"
    },
]

export default function Navbar() {
    const [opened, { toggle }] = useDisclosure(true);

    return (
        <nav className="navbar">
            {/* Srodo logo */}
            {/* <Text fw={700} size="xl" ml="sm" mb="lg" style={{ lineHeight: 1 }}>Šrodo</Text> */}
            
            <ScrollArea p="sm" scrollbarSize={8} scrollHideDelay={0} h="100%">

                {/* Menu items */}
                {menu.map((item) => <MenuItem item={item} />)}

                <Text fw={700} size="lg" px="md" pb="sm" pt="md" style={{ lineHeight: 1 }}>Predmety</Text>

                {categories.slice(0, 6).map((item) => <MenuItem item={item} />)}

                
                <Collapse in={opened}>
                    {categories.slice(6).map((item) => <MenuItem item={item} />)}
                </Collapse>

                {/* <Button
                onClick={toggle}
                className="menu-button"
                fw={400}
                mt="sm"
                size="sm"
                radius="lg"
                variant="subtle"
                color="dark"
                justify="flex-start"
            >
                Zobraziť viac
            </Button> */}

            <Button
            onClick={toggle}
                className="menu-button"
                fw={400}
                size="md"
                leftSection={opened ? <IconChevronUp stroke={1.25} /> : <IconChevronDown stroke={1.25} />}
                variant="subtle"
                color="dark"
                justify="flex-start"
                fullWidth
            >
                {opened ? "Zobraziť menej" : "Zobraziť viac"}
            </Button>
                {/* Navbar buttons */}
                {/* <Menu width={240}>
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
                </Menu> */}
                
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
            </ScrollArea>
            
            {/* <Link to="nastavenia">
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
            </Link> */}
        </nav>
    )
}

function MenuItem({ item }) {
    return (
        <Link key={item.label} to={item.link}>
            <Button
                className="menu-button"
                fw={400}
                size="md"
                leftSection={item.leftSection}
                rightSection={item.badge && <Badge variant="light">{item.badge}</Badge>}
                variant="subtle"
                color="dark"
                justify="flex-start"
                fullWidth
            >
                {item.label}
            </Button>
        </Link>
    )
}