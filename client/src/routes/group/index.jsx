import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AspectRatio, Box, Text, Flex, Loader, Tabs, Stack, Avatar, Badge, Button } from '@mantine/core';
import { IconLock, IconWorld } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from "react-redux";
import axios from "axios";

export default function Group() {
    const { groupId, tab = "prispevky" } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const fetchGroup = async () => {
        const group = await axios.get(`/api/group/${groupId}`)
        return group.data
    }

    const joinGroup = async () => {
        setIsLoading(true)
        await axios.patch(`/api/group/${groupId}/join`, {}, { headers })
        setIsLoading(false)
        queryClient.invalidateQueries("group")
    }

    const leaveGroup = async () => {
        setIsLoading(true)
        await axios.patch(`/api/group/${groupId}/leave`, {}, { headers })
        setIsLoading(false)
        queryClient.invalidateQueries("group")
    }

    const { data, status } = useQuery({
        queryFn: fetchGroup,
        queryKey: ["group", groupId],
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <Box px="md" py="sm">
                <AspectRatio ratio={6 / 2}>
                    <Box
                        className="lazy-image pointer"
                        style={{ backgroundImage: `url(${data.coverImage})` }}
                    />
                </AspectRatio>

                <Flex my="sm" justify="space-between" align="center">
                    <Text fw={700} size={24} style={{ lineHeight: 1 }}>
                        {data.name}
                    </Text>

                    {data.members.find(user => user._id == userId) || data.owner._id == userId ?
                        <Button onClick={leaveGroup} loading={isLoading}>Odísť</Button>
                        : <Button onClick={joinGroup} loading={isLoading}>Pripojiť sa</Button>
                    }
                </Flex>

                <Text style={{ lineHeight: 1.4 }}>
                    {data.description}
                </Text>

                <Flex gap={4}>
                    {data.isPrivate ?
                        <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                        : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                    }
                    <Text c="dimmed">{data.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                </Flex>
            </Box>

            <Tabs
                px="md"
                className="border-bottom"
                variant="unstyled"
                value={tab}
                onChange={newTab => {
                    navigate(`/skupiny/${data._id}/${newTab}`)
                }}
            >
                <Tabs.List className="custom-tabs">
                    <Tabs.Tab value="prispevky">
                        Príspevky
                    </Tabs.Tab>
                    <Tabs.Tab value="clenovia">
                        Členovia
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {tab === "prispevky" &&
                <>
                    {!data.posts &&
                        <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne príspevky</Text>
                    }
                </>
            }

            {tab === "clenovia" &&
                <>
                    <Box px="md" py="sm" className="border-bottom light-hover">
                        <UserProfile user={data.owner} badge="Majiteľ" />
                    </Box>

                    {data.members.map(member =>
                        <Box px="md" py="sm" className="border-bottom light-hover">
                            <UserProfile user={member} />
                        </Box>
                    )}
                </>
            }
        </>
    )
}

function UserProfile({ user, badge }) {
    return (
        <Link to={`/${user.username}`}>
            <Flex gap="xs" align="center">
                <Avatar src={user.profilePicture} />

                <Stack gap={4} style={{ flex: 1 }}>
                    <Flex gap={4} align="center">
                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                            {user.displayName}
                        </Text>
                        {badge && <Badge variant="light" size="xs" style={{ lineHeight: 1 }}>{badge}</Badge>}
                    </Flex>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                        @{user.username}
                    </Text>
                </Stack>
            </Flex>
        </Link>
    )
}