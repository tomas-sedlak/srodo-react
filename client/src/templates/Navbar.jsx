import { Badge, Text, Loader, Avatar, Button, Group, useMantineColorScheme, Box } from '@mantine/core';
import { HomeIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, SparklesIcon as SparklesIconSolid } from "@heroicons/react/24/solid"
import { useLocation, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginModal } from 'state';
import axios from 'axios';

const menu = [
    {
        label: "Domov",
        url: "/",
        leftSection: HomeIcon,
        leftSectionSelected: HomeIconSolid,
    },
    {
        label: "Preskúmať",
        url: "/preskumat",
        leftSection: MagnifyingGlassIcon,
        leftSectionSelected: MagnifyingGlassIconSolid,
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: SparklesIcon,
        leftSectionSelected: SparklesIconSolid,
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
                    {colorScheme === "light" ? <img width={36} height={36} src="/images/logo_light.svg" /> : <img width={36} height={36} src="/images/logo_dark.svg" />}
                    <Text ml={8} fw={700} fz={24}>Šrodo</Text>
                    <Badge ml={4} mb={8} variant="light" size="xs">BETA</Badge>
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
                        {active ?
                            <item.leftSectionSelected strokeWidth={1.25} width={24} height={24} />
                            :
                            <item.leftSection strokeWidth={1.25} width={24} height={24} />
                        }
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
                    <Avatar
                        size="sm"
                        src={user.profilePicture?.thumbnail}
                        style={{ outline: pathname.startsWith(`/${user.username}`) && "1.5px solid var(--mantine-color-text)" }}
                    />
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

            <Box style={{ overflowY: "auto" }}>
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
                            <Avatar
                                className="no-image"
                                size="sm"
                                radius="sm"
                                src={group.profilePicture?.thumbnail}
                            />

                                <span style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{group.name}</span>
                                {/* Verified icon */}
                                {group.verified &&
                                    <svg style={{ marginLeft: -6 }} color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                }
                                {group.badge && (
                                    <Badge variant="light">
                                        {group.badge}
                                    </Badge>
                                )}
                        </Link>
                    )
                })}
            </Box>
        </>
    )
}