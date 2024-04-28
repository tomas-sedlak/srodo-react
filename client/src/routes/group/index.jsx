import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AspectRatio, Box, Text, Flex, Loader, Tabs, Stack, Avatar, Badge, Button, Tooltip } from '@mantine/core';
import { IconLock, IconPencil, IconWorld } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import Post from "templates/Post";
import axios from "axios";

export default function Group() {
    const { groupId, tab = "prispevky" } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        if (!userId) {
            dispatch(setLoginModal(true))
            return
        }

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

                    {data.owner._id == userId ?
                        <Button
                            leftSection={<IconPencil stroke={1.25} />}
                            styles={{ section: { marginRight: 4 } }}
                        >
                            Upraviť
                        </Button>
                        : data.members.find(user => user._id == userId) ?
                            <Button
                                onClick={leaveGroup}
                                loading={isLoading}
                            >
                                Odísť
                            </Button>
                            : <Button
                                onClick={joinGroup}
                                loading={isLoading}
                            >
                                Pripojiť sa
                            </Button>
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

                <Box mt="sm" className="members-preview">
                    {data.members.slice(-12).map(member =>
                        <Tooltip label={`@${member.username}`} withArrow>
                            <Link to={`/${member.username}`} key={member._id}>
                                <Avatar
                                    src={member.profilePicture}
                                    style={{ outline: "var(--mantine-color-body) solid 2px" }}
                                />
                            </Link>
                        </Tooltip>
                    )}
                </Box>
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

            {tab === "prispevky" && <Posts groupId={groupId} />}

            {tab === "clenovia" && <Members owner={data.owner} members={data.members} />}
        </>
    )
}

function Posts({ groupId }) {
    const fetchPosts = async () => {
        const posts = await axios.get("/api/post/")
        return posts.data
    }

    const { data, status } = useQuery({
        queryFn: fetchPosts,
        queryKey: ["group-posts", groupId],
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
            {data.length === 0 &&
                <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne príspevky</Text>
            }

            {data.map(post => <Post post={post} />)}
        </>
    )
}

function Members({ owner, members }) {
    return (
        <>
            <UserProfile user={owner} badge="Majiteľ" />

            {members.map(member =>
                <UserProfile user={member} />
            )}
        </>
    )
}

function UserProfile({ user, badge }) {
    return (
        <Link to={`/${user.username}`} key={user._id}>
            <Flex gap="xs" align="center" px="md" py="sm" className="border-bottom light-hover">
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