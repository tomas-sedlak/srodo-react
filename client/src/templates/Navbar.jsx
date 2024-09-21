import { Badge, Text, Loader, Avatar, Button, Group, useMantineColorScheme } from '@mantine/core';
import { IconHome, IconHeart, IconPuzzle, IconSearch, IconBug } from '@tabler/icons-react';
import { useLocation, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import axios from 'axios';

const menu = [
    {
        label: "Domov",
        url: "/",
        leftSection: IconHome,
    },
    {
        label: "Preskúmať",
        url: "/preskumat",
        leftSection: IconSearch,
    },
    // {
    //     label: "Šrodo AI",
    //     url: "/ai",
    //     leftSection: IconPuzzle,
    //     badge: "nové!",
    // },
    {
        label: "Obľúbené",
        url: "/oblubene",
        leftSection: IconHeart,
    },
]

export default function Navbar({ close }) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { pathname } = useLocation();
    const userId = useSelector(state => state.user?._id)

    const fetchGroups = async () => {
        if (!userId) return []

        const response = await axios.get(`/api/user/${userId}/groups`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["groups", userId],
        queryFn: fetchGroups,
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

            <Link to="/">
                <Group gap={0} mb="lg">
                    {colorScheme === "light" ? <img width={36} height={36} src="/images/logo_light.png" /> : <img width={36} height={36} src="/images/logo_dark.png" />}
                    <Text ml={8} fw={700} fz={24}>Šrodo</Text>
                    <Badge ml={4} mb={8} variant="light" size="xs">BETA</Badge>
                </Group>
            </Link>

            {/* Navigation items */}
            {menu.map(item => {
                let active = false;
                if (item.url === "/") active = pathname === "/";
                else if (pathname.startsWith(item.url)) active = true;

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

            {/* Only for beta testing */}
            <Link
                key="report"
                to="https://forms.gle/LxgnHVcujEr8rjRD6"
                target="_blank"
                onClick={close}
                style={{ marginTop: "var(--mantine-spacing-sm)" }}
            >
                <Button
                    size="md"
                    fw={500}
                    justify="flex-start"
                    leftSection={<IconBug stroke={1.25} />}
                    fullWidth
                >
                    Nahlásiť bug
                </Button>
            </Link >
            {/* Only for beta testing */}

            {/* Subject items */}
            <Text fw={700} size="lg" px="sm" pb="sm" pt="md" style={{ lineHeight: 1 }}>Skupiny</Text>

            {!userId &&
                <Text px="sm" c="dimmed" style={{ lineHeight: 1.4 }}>Tu sa zobrazia tvoje skupiny po prihlásení.</Text>
            }

            {userId && data.length === 0 &&
                <Text px="sm" c="dimmed">Zatiaľ žiadne skupiny.</Text>
            }

            {userId && data.map(group => {
                const url = `/skupiny/${group._id}`;
                const active = url === pathname;

                return (
                    <Link
                        key={group.name}
                        to={url}
                        onClick={close}
                        className="menu-item"
                        data-active={active || undefined}
                    >
                        <Avatar className="no-image" size="sm" src={group.profilePicture?.thumbnail} />
                        <span style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{group.name}</span>
                        {group.badge && (
                            <Badge variant="light">
                                {group.badge}
                            </Badge>
                        )}
                    </Link>
                )
            })}
        </>
    )
}