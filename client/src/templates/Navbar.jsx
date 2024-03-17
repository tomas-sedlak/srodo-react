import { useDisclosure } from '@mantine/hooks';
import { Badge, Button, Collapse, Text, ScrollArea, Loader } from '@mantine/core';
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
            <p>Nastala chyba!</p>
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

function MenuItem({ label, leftSection, url, badge, close }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <Button
            key={label}
            className="light-hover"
            fw={400}
            size="md"
            px="sm"
            leftSection={leftSection}
            rightSection={badge && <Badge variant="light">{badge}</Badge>}
            variant="subtle"
            color="black"
            bg={url === pathname ? "gray.1" : "white"}
            mod={[url === pathname && "data-selected", "data-block"]}
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