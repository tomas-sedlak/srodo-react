import { useDisclosure } from '@mantine/hooks';
import { Badge, Button, Collapse, Text, ScrollArea } from '@mantine/core';
import { IconHome, IconNews, IconBookmark, IconRobot, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { Link } from "react-router-dom";

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

// Should be loaded from database!!!
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
// Should be loaded from database!!!

export default function Navbar() {
    const [subjectsOpened, { toggle }] = useDisclosure(false);

    return (
        <nav className="navbar">
            <ScrollArea p="sm" scrollbarSize={8} scrollHideDelay={0} h="100%">

                {/* Navigation items */}
                {menu.map((item) => <MenuItem item={item} />)}

                {/* Subject items */}
                <Text fw={700} size="lg" px="md" pb="sm" pt="md" style={{ lineHeight: 1 }}>Predmety</Text>

                {categories.slice(0, 6).map((item) => <MenuItem item={item} />)}

                <Collapse in={subjectsOpened}>
                    {categories.slice(6).map((item) => <MenuItem item={item} />)}
                </Collapse>

                <Button
                    onClick={toggle}
                    className="dark-hover"
                    fw={400}
                    size="md"
                    leftSection={subjectsOpened ? <IconChevronUp stroke={1.25} /> : <IconChevronDown stroke={1.25} />}
                    variant="subtle"
                    color="black"
                    justify="flex-start"
                    fullWidth
                >
                    {subjectsOpened ? "Zobraziť menej" : "Zobraziť viac"}
                </Button>
            </ScrollArea>
        </nav>
    )
}

function MenuItem({ item }) {
    return (
        <Link key={item.label} to={item.link}>
            <Button
                className="dark-hover"
                fw={400}
                size="md"
                leftSection={item.leftSection}
                rightSection={item.badge && <Badge variant="light">{item.badge}</Badge>}
                variant="subtle"
                color="black"
                justify="flex-start"
                fullWidth
            >
                {item.label}
            </Button>
        </Link>
    )
}