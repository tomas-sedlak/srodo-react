import { Badge, Avatar, Group } from '@mantine/core';
import { IconHome, IconCirclePlus, IconSearch, IconSparkles } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

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
        label: "Nový príspevok",
        url: "/vytvorit/skupina",
        leftSection: IconCirclePlus,
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: IconSparkles,
    },
]

export default function MobileNavbar({ close }) {
    const user = useSelector(state => state.user)
    const userId = user?._id

    return (
        <Group justify="space-around" w="100%">
            {menu.map(item => (
                    <Link
                        key={item.label}
                        to={item.url}
                        style={{ display: "flex" }}
                    >
                        <item.leftSection stroke={1} size={36} />
                    </Link>
                )
            )}

            {userId &&
                <Link
                    key="profile"
                    to={`/${user.username}`}
                    style={{ display: "flex" }}
                >
                    <Avatar size={36} src={user.profilePicture?.thumbnail} />
                </Link>
            }

            {!userId &&
                <Link
                    key="login"
                    to="/prihlasenie"
                    style={{ display: "flex" }}
                >
                    <Avatar size={36} />
                </Link>
            }
        </Group>
    )
}