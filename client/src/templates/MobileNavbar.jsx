import { Badge, Avatar, useMantineColorScheme, Tabs } from '@mantine/core';
import { IconHome, IconCirclePlus, IconCpu, IconSearch } from '@tabler/icons-react';
import { useLocation, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

import axios from 'axios';

import { useMediaQuery } from '@mantine/hooks';


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
        url: "/Vytvorit", //change this later to the route for creating
        leftSection: IconCirclePlus,
    },
    {
        label: "Šrodo AI",
        url: "/ai",
        leftSection: IconCpu,
        badge: "nové!",
    },
    {
        label: "Profil",
        url: "/", // add link to profile here
        leftSection: Avatar,
    },
]

export default function MobileNavbar({ close }) {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const { pathname } = useLocation()
    const userId = useSelector(state => state.user?._id)

    const isMobile = useMediaQuery('(max-width: 768px)')


    const fetchGroups = async () => {
        if (!userId) return []

        const response = await axios.get(`/api/user/${userId}/groups`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["groups", userId],
        queryFn: fetchGroups,
    })


    return (


        <Tabs
            defaultValue={menu[0].label}
            variant="outline"
            className='mobile-navbar-tabs'
            w="100%"
        >
            <Tabs.List grow>
                {menu.map(item => (
                    <Tabs.Tab
                        key={item.label}
                        value={item.label}
                        leftSection={<item.leftSection stroke={1.25} size={32} />}
                        onClick={() => window.location.href = item.url}
                    />
                ))}
                {/* <Tabs.Tab value="user" key="user">
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
                                <Avatar className="no-image" size={32} src={group.profilePicture?.thumbnail} /> {/* Not yet working...*/}
                                {/* <span style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{group.name}</span>
                                {group.badge && (
                                    <Badge variant="light">
                                        {group.badge}
                                    </Badge>
                                )}
                            </Link>
                        )
                    })} */}
                {/* </Tabs.Tab> */}
            </Tabs.List>
        </Tabs>

    )
}