import { useDisclosure } from '@mantine/hooks';
import { Badge, Collapse, Text, Loader } from '@mantine/core';
import { IconHome, IconArticle, IconHeart, IconPuzzle, IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useLocation, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const menu = [
    {
        label: "Domov",
        url: "/",
        leftSection: IconHome,
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: IconPuzzle,
        badge: "nové!",
    },
    {
        label: "Novinky",
        url: "/novinky",
        leftSection: IconArticle,
    },
    {
        label: "Obľúbené",
        url: "/oblubene",
        leftSection: IconHeart,
    },
]

export default function Navbar({ close }) {
    const { pathname } = useLocation();
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
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <Text>Nastala chyba!</Text>
        </div>
    ) : (
        <>
            {/* Navigation items */}
            {menu.map(item => {
                const active = item.url === pathname;

                return (
                    <Link
                        key={item.label}
                        to={item.url}
                        onClick={close}
                        className="menu-item"
                        data-active={active || undefined}
                    >
                        <item.leftSection stroke={1.25} />
                        <span>{item.label}</span>
                        {item.badge && (
                            <Badge variant="light">
                                {item.badge}
                            </Badge>
                        )}
                    </Link>
                )
            })}

            {/* Subject items */}
            <Text fw={700} size="lg" px="sm" pb="sm" pt="md" style={{ lineHeight: 1 }}>Predmety</Text>
            {data.slice(0, 6).map(item => {
                const url = `/predmety/${item.url}`;
                const active = url === pathname;

                return (
                    <Link
                        key={item.label}
                        to={url}
                        onClick={close}
                        className="menu-item"
                        data-active={active || undefined}
                    >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                        {item.badge && (
                            <Badge variant="light">
                                {item.badge}
                            </Badge>
                        )}
                    </Link>
                )
            })}

            <Collapse in={subjectsOpened}>
                {data.slice(6).map(item => {
                    const url = `/predmety/${item.url}`;
                    const active = url === pathname;

                    return (
                        <Link
                            key={item.label}
                            to={url}
                            onClick={close}
                            className="menu-item"
                            data-active={active || undefined}
                        >
                            <span>{item.emoji}</span>
                            <span>{item.label}</span>
                            {item.badge && (
                                <Badge variant="light">
                                    {item.badge}
                                </Badge>
                            )}
                        </Link>
                    )
                })}
            </Collapse>

            <a
                key="show-more"
                onClick={toggle}
                className="menu-item"
            >
                {subjectsOpened ? <IconChevronUp stroke={1.25} /> : <IconChevronDown stroke={1.25} />}
                <span>{subjectsOpened ? "Zobraziť menej" : "Zobraziť viac"}</span>
            </a>
        </>
    )
}