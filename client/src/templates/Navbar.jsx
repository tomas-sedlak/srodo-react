import { Badge, Text, Loader, Avatar, Button, Group, useMantineColorScheme } from '@mantine/core';
import { IconHome, IconSearch, IconSparkles } from '@tabler/icons-react';
import { useLocation, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginModal } from 'state';
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
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: IconSparkles,
        badge: "nové!",
    },
]

export default function Navbar() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const { pathname } = useLocation()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const userId = user?._id

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
                    {/* <Badge ml={4} mb={8} variant="light" size="xs">BETA</Badge> */}
                </Group>
            </Link>

            {/* Navigation items */}
            {menu.map(item => {
                let active = false;
                if (item.url === "/") active = pathname === "/"
                else if (pathname.startsWith(item.url)) active = true

                return (
                    <Link
                        key={item.label}
                        to={item.url}
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

            {!userId &&
                <Button
                    key="login"
                    size="md"
                    fw={600}
                    justify="center"
                    fullWidth
                    onClick={() => dispatch(setLoginModal(true))}
                    style={{ marginTop: "var(--mantine-spacing-xs)" }}
                >
                    Prihlásiť sa
                </Button>
            }

            {userId &&
                <Link
                    key="profil"
                    to={`/${user.username}`}
                    className="menu-item"
                    data-active={pathname.startsWith(`/${user.username}`) || undefined}
                >
                    <Avatar size="sm" src={user.profilePicture?.thumbnail} />
                    <span>Profil</span>
                </Link>
            }
            
            {userId &&
                <Link
                    key="new_group"
                    to="/vytvorit/skupina"
                    style={{ marginTop: "var(--mantine-spacing-xs)" }}
                >
                    <Button
                        size="md"
                        fw={600}
                        justify="center"
                        fullWidth
                    >
                        Vytvoriť skupinu
                    </Button>
                </Link >
            }

            <Text fw={700} size="lg" px="sm" pb="sm" pt="lg" style={{ lineHeight: 1 }}>Moje skupiny</Text>

            {!userId &&
                <Text px="sm" c="dimmed" style={{ lineHeight: 1.4 }}>Tu sa zobrazia tvoje skupiny po prihlásení.</Text>
            }

            {userId && data.length === 0 &&
                <Text px="sm" c="dimmed">Zatiaľ žiadne skupiny.</Text>
            }

            {userId && data.map(group => {
                const url = `/skupiny/${group._id}`
                const active = url === pathname

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