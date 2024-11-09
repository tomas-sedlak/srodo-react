import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AspectRatio, Box, Text, Flex, Loader, Tabs, Stack, Avatar, Badge, Button, Tooltip, TextInput, Image, Menu, Modal, ActionIcon } from '@mantine/core';
import { IconLock, IconPencil, IconWorld, IconSearch, IconX, IconDots, IconTrash, IconFlag, IconPlus, IconClipboard, IconCalendarMonth } from '@tabler/icons-react';
import { modals } from "@mantine/modals";
import { useDebounceCallback, useMediaQuery, useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import { notifications } from "@mantine/notifications";
import { Helmet } from "react-helmet";
import Post from "templates/Post";
import CreatePost from "templates/CreatePost";
import axios from "axios";
import Message from "templates/Message";
import { ReportModal } from "templates/ReportModal";
import SmallHeader from "templates/SmallHeader";
import AdSenseAd from "templates/AdSenseAd";

import moment from "moment";
import "moment/dist/locale/sk";
import MembersDisplay from "templates/MembersDisplay";
moment.locale("sk");

export default function Group() {
    const { groupId, tab = "prispevky" } = useParams();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const profilePictureSize = isMobile ? 96 : 128;
    const [urlModalOpened, setUrlModalOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const [opened, { open, close }] = useDisclosure(false);
    // const [reportReason, setReportReason] = useState('');


    const fetchGroup = async () => {
        const group = await axios.get(`/api/group/${groupId}`, userId && { headers })
        return group.data
    }

    const joinGroup = async () => {
        if (!userId) {
            dispatch(setLoginModal(true))
            return
        }

        setIsLoading(true)
        await axios.patch(`/api/group/${groupId}/join`, {}, { headers })
        await queryClient.invalidateQueries("groups")
        setIsLoading(false)
    }

    const leaveGroup = async () => {
        if (!userId) {
            dispatch(setLoginModal(true))
            return
        }

        setIsLoading(true)
        await axios.patch(`/api/group/${groupId}/leave`, {}, { headers })
        await queryClient.invalidateQueries("groups")
        setIsLoading(false)
    }

    const deleteGroup = async () => {
        if (!userId) return
        await axios.delete(`/api/group/${groupId}`, { headers })
        navigate("/");

        notifications.show({
            title: "Skupina zmazaná",
        });
    }

    const { data, status } = useQuery({
        queryFn: fetchGroup,
        queryKey: ["group", groupId, userId],
        retry: () => {
            return false;
        }
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <Message title="Nastala chyba! 💔" content="Skupina, ktorú hľadáš, nebola nájdená." />
        </div>
    ) : (
        <>
            <Helmet>
                <title>{`${data.name} / Šrodo`}</title>
                <meta name="description" content={`${data.isPrivate ? "Súkromná" : "Verejná"} skupina, ${data.membersLength} členov - ${data.name} na Šrodo: "${data.description}"`} />
            </Helmet>

            {data.isPrivate && <UrlModal url={`https://srodo.sk/pozvanka/${data.privateKey}`} opened={urlModalOpened} close={setUrlModalOpened} />}

            <ReportModal opened={opened} close={close} />

            <SmallHeader withArrow title={data.name} />

            < AspectRatio ratio={6 / 2}>
                {data.coverImage ?
                    <Image className="no-image" src={data.coverImage} />
                    : <Box className="no-image"></Box>
                }
            </AspectRatio >

            <div style={{ position: "relative" }}>
                <Avatar
                    className="profile-picture"
                    size={profilePictureSize}
                    radius="md"
                    src={data.profilePicture?.large}
                />
            </div>

            <Flex px="md" h={profilePictureSize / 2} gap={8} justify="flex-end" align="center">
                {data.owner == userId && data.isPrivate &&
                    <Button
                        variant="filled"
                        leftSection={<IconPlus stroke={1.25} />}
                        styles={{ section: { marginRight: 4 } }}
                        onClick={() => setUrlModalOpened(true)}
                    >
                        Pozvať
                    </Button>
                }
                {data.owner == userId ?
                    <Button
                        variant="default"
                        leftSection={<IconPencil stroke={1.25} />}
                        styles={{ section: { marginRight: 4 } }}
                        onClick={() => navigate(`/skupiny/${groupId}/upravit`)}
                    >
                        Upraviť
                    </Button>
                    : data.isMember ?
                        <Button
                            variant="default"
                            onClick={() => {
                                leaveGroup()
                                data.isPrivate && navigate("/", { replace: true })
                            }}
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
                        {data.owner == userId ?
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
                                <Text fw={600} size="sm" onClick={open}>Nahlásiť</Text>
                            </Menu.Item>
                        }
                    </Menu.Dropdown>
                </Menu>
            </Flex>

            <Box px="md" py="sm">
                <Flex gap={4}>
                    <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>
                        {data.name}
                    </Text>
                    {/* Verified icon */}
                    {data.verified &&
                        <svg color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                    }
                </Flex>

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    {data.description}
                </Text>

                <Flex rowGap={4} columnGap="md" mt={8} wrap="wrap">
                    <Flex gap={4}>
                        {data.isPrivate ?
                            <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                            : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                        }
                        <Text c="dimmed" style={{ whiteSpace: "nowrap" }}>{data.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                    </Flex>
                    <Flex gap={4}>
                        <IconCalendarMonth color="var(--mantine-color-dimmed)" stroke={1.25} />
                        <Text c="dimmed" style={{ whiteSpace: "nowrap" }}>{moment(data.createdAt).format("D. MMMM yyyy")}</Text>
                    </Flex>
                </Flex>

                <Link to={`/skupiny/${data._id}/clenovia`} style={{ marginTop: 8, display: "inline-block" }}>
                    <MembersDisplay members={data.members} membersCount={data.membersCount} />
                </Link>
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

            {tab === "prispevky" && <Posts groupId={groupId} isMember={data.isMember} owner={data.owner} />}

            {tab === "clenovia" && <Members groupId={groupId} owner={data.owner} />}
        </>
    )
}

function Posts({ groupId, isMember, owner }) {
    const userId = useSelector(state => state.user?.id);
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const fetchPosts = async () => {
        const response = await axios.get(`/api/group/${groupId}/posts`, userId && { headers })
        return response.data
    }

    const { data, status } = useQuery({
        queryFn: fetchPosts,
        queryKey: ["group", "posts", groupId],
    });

    return (
        <>
            {isMember &&
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

                    {data.map((post, i) => {
                        if (i == 1 || i + 1 % 10 == 0) {
                            return (
                                <>
                                    <Box className="border-bottom">
                                        <AdSenseAd
                                            adClient="ca-pub-4886377834765269"
                                            adSlot="1202718334"
                                        />
                                    </Box>
                                    <Post post={post} owner={owner} group />
                                </>
                            )
                        } else {
                            return <Post post={post} owner={owner} group />
                        }
                    })}
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
                        <UserProfile user={member} badge={member._id === owner && "Admin"} />
                    )}
                </>
            )}
        </>
    )
}

export function UserProfile({ user, badge }) {
    return (
        <Link to={`/${user.username}`} key={user._id}>
            <Flex gap="xs" align="center" px="md" py="sm" className="border-bottom light-hover">
                <Avatar className="no-image" src={user.profilePicture?.thumbnail} />

                <Stack gap={4} style={{ flex: 1 }}>
                    <Flex gap={4} align="center">
                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                            {user.displayName}
                        </Text>
                        {/* Verified icon */}
                        {user.verified &&
                            <svg color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                        }
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

function UrlModal({ url, opened, close }) {
    return (
        <Modal
            opened={opened}
            onClose={close}
            title={<Text fz="lg" fw={700}>Pozvať do skupiny</Text>}
            radius="lg"
            centered
        >
            <Text c="dimmed" style={{ lineHeight: 1.4 }}>Pošli svojim priateľom tento link s ktorým sa budú vedieť pridať do tvojej skupiny.</Text>

            <Flex mt="sm" gap={8}>
                <TextInput value={url} style={{ flex: 1 }} />
                <Tooltip label="Skopírovať URL">
                    <ActionIcon
                        w={36}
                        h={36}
                        onClick={() => {
                            navigator.clipboard.writeText(url)
                            notifications.show({
                                title: "Skopírované do schránky",
                            })
                        }}
                    >
                        <IconClipboard stroke={1.25} />
                    </ActionIcon>
                </Tooltip>
            </Flex>
        </Modal>
    )
}