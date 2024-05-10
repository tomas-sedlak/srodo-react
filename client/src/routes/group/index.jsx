import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AspectRatio, Box, Text, Flex, Loader, Tabs, Stack, Avatar, Badge, Button, Tooltip, TextInput, Image, Menu } from '@mantine/core';
import { IconLock, IconPencil, IconWorld, IconSearch, IconX, IconDots, IconTrash, IconFlag } from '@tabler/icons-react';
import { modals } from "@mantine/modals";
import { useDebounceCallback, useMediaQuery } from "@mantine/hooks";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import Post from "templates/Post";
import CreatePost from "templates/CreatePost";
import axios from "axios";

export default function Group() {
    const { groupId, tab = "prispevky" } = useParams();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const profilePictureSize = isMobile ? 96 : 128;
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
        queryClient.invalidateQueries("group")
        setIsLoading(false)
    }

    const leaveGroup = async () => {
        if (!userId) {
            dispatch(setLoginModal(true))
            return
        }

        setIsLoading(true)
        await axios.patch(`/api/group/${groupId}/leave`, {}, { headers })
        queryClient.invalidateQueries("group")
        setIsLoading(false)
    }

    const deleteGroup = async () => {
        if (!userId) return
        await axios.delete(`/api/group/${groupId}`, { headers })
        queryClient.invalidateQueries("group");
        navigate("/")
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
            <AspectRatio ratio={6 / 2}>
                {data.coverImage ?
                    <Image src={data.coverImage} />
                    : <Box className="no-image"></Box>
                }
            </AspectRatio>

            <div style={{ position: "relative" }}>
                <Avatar
                    className="profile-picture"
                    size={profilePictureSize}
                    src={data.profilePicture}
                />
            </div>

            <Flex px="md" h={profilePictureSize / 2} gap={8} justify="flex-end" align="center">
                {data.owner._id == userId ?
                    <Button
                        variant="default"
                        leftSection={<IconPencil stroke={1.25} />}
                        styles={{ section: { marginRight: 4 } }}
                    >
                        Upraviť
                    </Button>
                    : data.members.find(user => user._id == userId) ?
                        <Button
                            variant="default"
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

                <Menu position="bottom-end" width={180}>
                    <Menu.Target>
                        <Button
                            variant="default"
                            px={8}
                        >
                            <IconDots stroke={1.25} style={{ width: 20, height: 20 }} />
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {data.owner._id == userId ?
                            <Menu.Item
                                leftSection={<IconTrash stroke={1.25} />}
                                color="red"
                                onClick={event => {
                                    event.preventDefault()
                                    modals.openConfirmModal({
                                        title: "Zmazať skupinu",
                                        children: <Text>Určite chceš zmazať túto skupinu?</Text>,
                                        centered: true,
                                        labels: { confirm: "Zmazať", cancel: "Zrušiť" },
                                        confirmProps: { color: "red" },
                                        onConfirm: deleteGroup,
                                    })
                                }}
                            >
                                <Text fw={600} size="sm">Zmazať skupinu</Text>
                            </Menu.Item>
                            : <Menu.Item
                                leftSection={<IconFlag stroke={1.25} />}
                            >
                                <Text fw={600} size="sm">Nahlásiť</Text>
                            </Menu.Item>
                        }
                    </Menu.Dropdown>
                </Menu>
            </Flex>

            <Box px="md" py="sm">
                <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>
                    {data.name}
                </Text>

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    {data.description}
                </Text>

                <Flex gap={4} mt={4}>
                    {data.isPrivate ?
                        <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                        : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                    }
                    <Text c="dimmed">{data.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                </Flex>

                {data.members.length > 1 &&
                    <Box mt="sm" className="members-preview">
                        {data.members.slice(-12).map(member =>
                            <Tooltip label={`@${member.username}`} openDelay={200} withArrow>
                                <Link to={`/${member.username}`} key={member._id}>
                                    <Avatar
                                        className="no-image"
                                        src={member.profilePicture}
                                        style={{ outline: "var(--mantine-color-body) solid 2px" }}
                                    />
                                </Link>
                            </Tooltip>
                        )}
                    </Box>
                }
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

            {tab === "prispevky" && <Posts groupId={groupId} owner={data.owner} />}

            {tab === "clenovia" && <Members groupId={groupId} owner={data.owner} />}
        </>
    )
}

function Posts({ groupId, owner }) {
    const userId = useSelector(state => state.user?._id);

    const fetchPosts = async () => {
        const response = await axios.get(`/api/group/${groupId}/posts`)
        return response.data
    }

    const { data, status } = useQuery({
        queryFn: fetchPosts,
        queryKey: ["group", "posts", groupId],
    });

    return (
        <>
            {userId &&
                <CreatePost groupId={groupId} />
            }

            {status === "pending" ? (
                <div className="loader-center-x">
                    <Loader />
                </div>
            ) : status === "error" ? (
                <div className="loader-center-x">
                    <p>Nastala chyba!</p>
                </div>
            ) : (
                <>
                    {data.length === 0 &&
                        <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne príspevky</Text>
                    }

                    {data.map(post => <Post post={post} owner={owner} />)}
                </>
            )}
        </>
    )
}

function Members({ groupId, owner }) {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = useDebounceCallback(async () => {
        refetch()
    }, 500)

    const handleChange = value => {
        setSearchValue(value)
        handleSearch()
    }

    const fetchMembers = async () => {
        const response = await axios.get(`/api/group/${groupId}/members?q=${searchValue}`)
        return response.data
    }

    const { data, status, refetch, isFetching } = useQuery({
        queryFn: fetchMembers,
        queryKey: ["group", "members", groupId],
    })

    return (
        <>
            <TextInput
                px="md"
                py="sm"
                size="md"
                className="border-bottom"
                placeholder="Hľadať členov"
                value={searchValue}
                onChange={event => handleChange(event.currentTarget.value)}
                leftSection={<IconSearch stroke={1.25} />}
                rightSection={
                    searchValue !== "" && (
                        <IconX
                            className="pointer"
                            onClick={() => handleChange("")}
                            stroke={1.25}
                        />
                    )
                }
            />

            {status === "pending" || isFetching ? (
                <div className="loader-center-x">
                    <Loader />
                </div>
            ) : status === "error" ? (
                <div className="loader-center-x">
                    <p>Nastala chyba!</p>
                </div>
            ) : (
                <>
                    {data.length === 0 &&
                        <Text px="md" py="sm" c="dimmed">Neboli nájdení žiadni členovia</Text>
                    }

                    {data.map(member =>
                        <UserProfile user={member} badge={member._id === owner._id && "Admin"} />
                    )}
                </>
            )}
        </>
    )
}

function UserProfile({ user, badge }) {
    return (
        <Link to={`/${user.username}`} key={user._id}>
            <Flex gap="xs" align="center" px="md" py="sm" className="border-bottom light-hover">
                <Avatar className="no-image" src={user.profilePicture} />

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