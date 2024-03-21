import { useDisclosure } from '@mantine/hooks';
import { Badge, Button, Collapse, Text, ScrollArea, Loader, useMantineColorScheme } from '@mantine/core';
import { IconHome, IconNews, IconHeart, IconRobot, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const menu = [
    {
        label: "Domov",
        url: "/",
        leftSection: <IconHome stroke={1.25} />
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: <IconRobot stroke={1.25} />,
        badge: "Nové!"
    },
    {
        label: "Novinky",
        url: "/novinky",
        leftSection: <IconNews stroke={1.25} />
    },
    {
        label: "Obľúbené",
        url: "/oblubene",
        leftSection: <IconHeart stroke={1.25} />
    },
]

export default function Navbar({ close }) {
    const { colorScheme } = useMantineColorScheme();
    const [subjectsOpened, { toggle }] = useDisclosure(false);

    const fetchSubjects = async () => {
        const response = await axios.get("/api/subjects")
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["subjects"],
        queryFn: fetchSubjects,
        staleTime: Infinity,
    })

    return status === "pending" ? (
        <div className="loader-center-x">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <Text>Nastala chyba!</Text>
        </div>
    ) : (
        <ScrollArea scrollbarSize={8} scrollHideDelay={0} h="100%">

            {/* Navigation items */}
            {menu.map(item => <MenuItem
                label={item.label}
                leftSection={item.leftSection}
                url={item.url}
                badge={item.badge}
                close={close}
            />)}

            {/* Subject items */}
            <Text fw={700} size="lg" px="sm" pb="sm" pt="md" style={{ lineHeight: 1 }}>Predmety</Text>
            {data.slice(0, 6).map(item => <MenuItem
                label={item.label}
                leftSection={item.emoji}
                url={`/predmety/${item.url}`}
                close={close}
            />)}

            <Collapse in={subjectsOpened}>
                {data.slice(6).map(item => <MenuItem
                    label={item.label}
                    leftSection={item.emoji}
                    url={`/predmety/${item.url}`}
                    close={close}
                />)}
            </Collapse>

            <Button
                fw={400}
                size="md"
                leftSection={subjectsOpened ? <IconChevronUp stroke={1.25} /> : <IconChevronDown stroke={1.25} />}
                variant="subtle"
                color={colorScheme === "light" ? "black" : "gray"}
                justify="flex-start"
                fullWidth
                onClick={toggle}
            >
                {subjectsOpened ? "Zobraziť menej" : "Zobraziť viac"}
            </Button>
        </ScrollArea>
    )
}

function MenuItem({ label, leftSection, url, badge, close }) {
    const { colorScheme } = useMantineColorScheme();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Button
            key={label}
            fw={400}
            size="md"
            leftSection={leftSection}
            rightSection={badge && <Badge variant="light">{badge}</Badge>}
            variant={url === pathname ? "light" : "subtle"}
            // color={colorScheme === "light" ? "black" : "gray"}
            color="gray"
            c="var(--mantine-color-text)"
            justify="flex-start"
            fullWidth
            onClick={() => {
                close && close()
                navigate(url)
            }}
        >
            {label}
        </Button>
    )
}