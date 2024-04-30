import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AspectRatio, Box, Text, Flex, Loader, Tabs, Stack, Avatar, Badge, Button, Tooltip, Textarea, ActionIcon, TextInput, Image } from '@mantine/core';
import { IconCopyCheck, IconGif, IconLock, IconPaperclip, IconPencil, IconPhoto, IconWorld, IconSearch, IconX } from '@tabler/icons-react';
import { useMediaQuery } from "@mantine/hooks";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import axios from "axios";
import Post from "templates/Post";

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
        queryKey: ["group", "posts", groupId],
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

            <Flex px="md" h={profilePictureSize / 2} justify="flex-end" align="center">
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

            <Box px="md" py="sm">
                <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>
                    {data.name}
                </Text>

                <Text mt="sm">
                    {data.description}
                </Text>

                <Flex gap={4}>
                    {data.isPrivate ?
                        <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                        : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                    }
                    <Text c="dimmed">{data.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                </Flex>

                {data.members.length > 1 &&
                    <Box mt="sm" className="members-preview">
                        {data.members.slice(-12).map(member =>
                            <Tooltip label={`@${member.username}`} withArrow>
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

            {tab === "clenovia" && <Members owner={data.owner} members={data.members} />}
        </>
    )
}

function Posts({ groupId, owner }) {
    const user = useSelector(state => state.user);

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
            {user &&
                <Flex px="md" py="sm" gap="xs" align="flex-start" className="border-bottom">
                    <Avatar mt={3} className="no-image" src={user.profilePicture} />

                    <Stack gap={8} style={{ flex: 1 }}>
                        <Textarea
                            // variant="unstyled"
                            minRows={1}
                            autosize
                            size="md"
                            placeholder="Napíš niečo..."
                        />

                        <Flex justify="space-between" align="center">
                            <Flex gap={8}>
                                <Tooltip label="Obrázok" position="bottom" openDelay={500} withArrow>
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        radius="xl"
                                    >
                                        <IconPhoto stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="GIF" position="bottom" openDelay={500} withArrow>
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        radius="xl"
                                    >
                                        <IconGif stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Súbor" position="bottom" openDelay={500} withArrow>
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        radius="xl"
                                    >
                                        <IconPaperclip stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Kvíz" position="bottom" openDelay={500} withArrow>
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        radius="xl"
                                    >
                                        <IconCopyCheck stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>
                            </Flex>

                            <Button>
                                Publikovať
                            </Button>
                        </Flex>
                    </Stack>
                </Flex>
            }

            {data.length === 0 &&
                <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne príspevky</Text>
            }

            {data.map(post => <Post post={post} />)}
        </>
    )
}

function Members({ owner, members }) {
    const [searchValue, setSearchValue] = useState("");

    return (
        <>
            <TextInput
                px="md"
                py="sm"
                size="md"
                className="border-bottom"
                placeholder="Hľadať členov"
                value={searchValue}
                onChange={event => setSearchValue(event.target.value)}
                leftSection={<IconSearch stroke={1.25} />}
                rightSection={
                    searchValue !== "" && (
                        <IconX
                            className="pointer"
                            onClick={() => setSearchValue("")}
                            stroke={1.25}
                        />
                    )
                }
            />

            {members.map(member =>
                <UserProfile user={member} badge={member._id === owner._id && "Admin"} />
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