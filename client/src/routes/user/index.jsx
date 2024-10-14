import { Link, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { AspectRatio, Stack, Avatar, Text, Group, Image, Box, Loader, Tabs, Badge, Button, Menu } from "@mantine/core";
import { IconCalendarMonth, IconDots, IconLock, IconLogout, IconSettings, IconWorld } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "state";
import { Helmet } from "react-helmet";
import SmallHeader from "templates/SmallHeader";
import Post from "templates/Post";
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function User() {
    const { username, tab = "prispevky" } = useParams();
    const userId = useSelector(state => state.user?._id);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const profilePictureSize = isMobile ? 96 : 128;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getData = async () => {
        const user = await axios.get(`/api/user?username=${username}`);
        const posts = await axios.get(`/api/user/${user.data._id}/posts`);
        const groups = await axios.get(`/api/user/${user.data._id}/groups`);
        return { user: user.data, posts: posts.data, groups: groups.data }
    }

    const { data, status } = useQuery({
        queryFn: getData,
        queryKey: ["userPage", username, userId],
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
            <Helmet>
                <title>{`${data.user.displayName} (@${data.user.username})`}</title>
                <meta name="description" content={`${data.posts.length} príspevkov - ${data.user.displayName} (@${data.user.username}) na Šrodo: "${data.user.bio}"`} />
            </Helmet>

            <SmallHeader withArrow title={data.user.displayName} />

            <AspectRatio ratio={6 / 2}>
                {data.user.coverImage ?
                    <Image className="no-image" src={data.user.coverImage} />
                    : <Box className="no-image"></Box>
                }
            </AspectRatio>

            <div style={{ position: "relative" }}>
                <Avatar
                    className="profile-picture"
                    size={profilePictureSize}
                    src={data.user.profilePicture?.large}
                />
            </div>

            <Group px="md" h={profilePictureSize / 2} gap={8} justify="flex-end" align="center">
                {data.user._id == userId &&
                    <>
                        <Button
                            variant="default"
                            leftSection={<IconSettings stroke={1.25} />}
                            styles={{ section: { marginRight: 4 } }}
                            onClick={() => navigate("/nastavenia")}
                        >
                            Nastavenia
                        </Button>

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
                                <Menu.Item
                                    leftSection={<IconLogout stroke={1.25} />}
                                    color="red"
                                    onClick={() => dispatch(setLogout())}
                                >
                                    <Text fw={600} size="sm">Odhlásť sa</Text>
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </>
                }
            </Group>

            <Box px="md" py="sm">
                <Stack gap={4}>
                    <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>
                        {data.user.displayName}
                    </Text>
                    <Text c="dimmed" style={{ lineHeight: 1 }}>@{data.user.username}</Text>
                </Stack>

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    {data.user.bio}
                </Text>

                <Group gap={4} mt={4}>
                    <IconCalendarMonth color="var(--mantine-color-dimmed)" stroke={1.25} />
                    <Text c="dimmed" style={{ lineHeight: 1.4 }}>{moment(data.user.createdAt).format("D. MMMM yyyy")}</Text>
                </Group>

                {data.user.socials.length !== 0 &&
                    <Group mt="sm" gap={4}>
                        {data.user.socials.map(social =>
                            <Link className="icon-wrapper" to={social.url} target="_blank">
                                <img width={24} height={24} src={social.icon} />
                                <span>{social.displayText}</span>
                            </Link>
                        )}
                    </Group>
                }
            </Box>

            <Tabs
                px="md"
                className="border-bottom"
                variant="unstyled"
                value={tab}
                onChange={newTab => {
                    navigate(`/${data.user.username}/${newTab}`)
                }}
            >
                <Tabs.List className="custom-tabs">
                    <Tabs.Tab value="prispevky">
                        Príspevky
                    </Tabs.Tab>
                    <Tabs.Tab value="skupiny">
                        Skupiny
                    </Tabs.Tab>
                    <Tabs.Tab value="ocenenia">
                        Ocenenia
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {tab === "prispevky" &&
                <>
                    {data.posts.length === 0 &&
                        <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne príspevky</Text>
                    }

                    {data.posts.map(post => <Post post={post} />)}
                </>
            }

            {tab === "skupiny" &&
                <>
                    {data.groups.length === 0 &&
                        <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne skupiny</Text>
                    }

                    {data.groups.map(group =>
                        <Link to={`/skupiny/${group._id}`} key={group._id}>
                            <Group gap="xs" px="md" py="sm" className="border-bottom light-hover">
                                <Avatar className="no-image" src={group.profilePicture?.thumbnail} />

                                <Stack gap={4} style={{ flex: 1 }}>
                                    <Group gap={4}>
                                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                            {group.name}
                                        </Text>
                                        {data.user._id === group.owner &&
                                            <Badge variant="light" size="xs">Admin</Badge>
                                        }
                                    </Group>
                                    <Group gap={2}>
                                        {group.isPrivate ?
                                            <IconLock color="var(--mantine-color-dimmed)" width={16} height={16} stroke={1.25} />
                                            : <IconWorld color="var(--mantine-color-dimmed)" width={16} height={16} stroke={1.25} />
                                        }
                                        <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>{group.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                                    </Group>
                                </Stack>
                            </Group>
                        </Link>
                    )}
                </>
            }

            {tab === "ocenenia" &&
                <Box px="md" py="sm">
                    <Text c="dimmed">🎉 COMING SOON 🎉</Text>
                </Box>
            }
        </>
    );
}