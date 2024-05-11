import { Badge, Text, Loader, Avatar } from '@mantine/core';
import { IconHome, IconHeart, IconPuzzle, IconSearch } from '@tabler/icons-react';
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
    const { pathname } = useLocation();
    const userId = useSelector(state => state.user?._id)

    const fetchGroups = async () => {
        if (!userId) return []

        const response = await axios.get(`/api/user/${userId}/groups`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["groups"],
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
                        <Avatar className="no-image" size="sm" src={group.profilePicture.thumbnail} />
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