import { Avatar, Group } from '@mantine/core';
import { Link, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import { HomeIcon, MagnifyingGlassIcon, PlusCircleIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { HomeIcon as HomeIconSolid, MagnifyingGlassIcon as MagnifyingGlassIconSolid, PlusCircleIcon as PlusCircleIconSolid, SparklesIcon as SparklesIconSolid } from "@heroicons/react/24/solid"

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
        label: "Nový príspevok",
        url: "/vytvorit/skupina",
        leftSection: PlusCircleIcon,
        leftSectionSelected: PlusCircleIconSolid,
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: SparklesIcon,
        leftSectionSelected: SparklesIconSolid,
    },
]

export default function MobileNavbar({ close }) {
    const { pathname } = useLocation()
    const user = useSelector(state => state.user)
    const userId = user?._id

    return (
        <Group justify="space-around" w="100%">
            {menu.map(item => {
                let active = false;
                if (item.url === "/") active = pathname === "/"
                else if (pathname.startsWith(item.url)) active = true

                return (
                    <Link
                        key={item.label}
                        to={item.url}
                        style={{ display: "flex" }}
                    >
                        {active ?
                            <item.leftSectionSelected strokeWidth={1.25} width={36} height={36} />
                            :
                            <item.leftSection strokeWidth={1.25} width={36} height={36} />
                        }
                    </Link>
                )
            })}

            {userId &&
                <Link
                    key="profile"
                    to={`/${user.username}`}
                    style={{ display: "flex" }}
                >
                    <Avatar
                        size={36}
                        src={user.profilePicture?.thumbnail}
                        style={{ outline: pathname.startsWith(`/${user.username}`) && "2px solid var(--mantine-color-text)" }}
                    />
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