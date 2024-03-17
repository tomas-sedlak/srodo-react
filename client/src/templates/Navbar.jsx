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
        emoji: <IconHome stroke={1.25} />
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        emoji: <IconRobot stroke={1.25} />,
        badge: "Nové!"
    },
    {
        label: "Novinky",
        url: "/novinky",
        emoji: <IconNews stroke={1.25} />
    },
    {
        label: "Obľúbené",
        url: "/oblubene",
        emoji: <IconHeart stroke={1.25} />
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
            {menu.map((item) => <MenuItem item={item} close={close} />)}

            {/* Subject items */}
            <Text fw={700} size="lg" px="sm" pb="sm" pt="md" style={{ lineHeight: 1 }}>Predmety</Text>
            {data.slice(0, 6).map((item) => <MenuItem item={item} close={close} />)}

            <Collapse in={subjectsOpened}>
                {data.slice(6).map((item) => <MenuItem item={item} close={close} />)}
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
            leftSection={item.emoji}
            rightSection={item.badge && <Badge variant="light">{item.badge}</Badge>}
            variant="subtle"
            color="black"
            bg={item.url === pathname ? "gray.1" : "white"}
            mod={[item.url === pathname && "data-selected", "data-block"]}
            justify="flex-start"
            fullWidth
            onClick={() => {
                close && close()
                navigate(item.url)
            }}
        >
            {item.label}
        </Button>
    )
}