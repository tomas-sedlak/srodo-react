import { useDisclosure } from '@mantine/hooks';
import { Badge, Button, Collapse, Text, ScrollArea } from '@mantine/core';
import { IconHome, IconNews, IconBookmark, IconRobot, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useNavigate, useLocation } from "react-router-dom";

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
        link: "/matematika",
        leftSection: "📈"
    },
    {
        label: "Informatika",
        link: "/informatika",
        leftSection: "💻"
    },
    {
        label: "Jazyky",
        link: "/jazyky",
        leftSection: "💬"
    },
    {
        label: "Biológia",
        link: "/biologia",
        leftSection: "🧬"
    },
    {
        label: "Chémia",
        link: "/chemia",
        leftSection: "🧪"
    },
    {
        label: "Fyzika",
        link: "/fyzika",
        leftSection: "⚡"
    },
    {
        label: "Geografia",
        link: "/geografia",
        leftSection: "🌍"
    },
    {
        label: "Umenie",
        link: "/umenie",
        leftSection: "🎨"
    },
    {
        label: "Šport",
        link: "/sport",
        leftSection: "💪"
    },
]
// Should be loaded from database!!!

export default function Navbar({ close }) {
    const [subjectsOpened, { toggle }] = useDisclosure(false);

    return (
        <ScrollArea scrollbarSize={8} scrollHideDelay={0} h="100%">

            {/* Navigation items */}
            {menu.map((item) => <MenuItem item={item} close={close} />)}

            {/* Subject items */}
            <Text fw={700} size="lg" px="sm" pb="sm" pt="md" style={{ lineHeight: 1 }}>Predmety</Text>

            {categories.slice(0, 6).map((item) => <MenuItem item={item} close={close} />)}

            <Collapse in={subjectsOpened}>
                {categories.slice(6).map((item) => <MenuItem item={item} close={close} />)}
            </Collapse>

            <Button
                onClick={toggle}
                className="light-hover"
                fw={400}
                size="md"
                px="sm"
                leftSection={subjectsOpened ? <IconChevronUp stroke={1.25} /> : <IconChevronDown stroke={1.25} />}
                variant="subtle"
                color="black"
                justify="flex-start"
                fullWidth
            >
                {subjectsOpened ? "Zobraziť menej" : "Zobraziť viac"}
            </Button>
        </ScrollArea>
    )
}

function MenuItem({ item, close }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Button
            key={item.label}
            className="light-hover"
            fw={400}
            size="md"
            px="sm"
            leftSection={item.leftSection}
            rightSection={item.badge && <Badge variant="light">{item.badge}</Badge>}
            variant="subtle"
            color="black"
            bg={item.link === pathname ? "gray.1" : "white"}
            mod={[item.link === pathname && "data-selected", "data-block"]}
            justify="flex-start"
            fullWidth
            onClick={() => {
                close && close()
                navigate(item.link)
            }}
        >
            {item.label}
        </Button>
    )
}