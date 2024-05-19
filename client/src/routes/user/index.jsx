import { Link, useNavigate, useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { AspectRatio, Stack, Avatar, Text, Group, Image, Box, Loader, Tabs, Badge } from "@mantine/core";
import { IconLock, IconWorld } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
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

            <Box px="md" py="sm" mt={profilePictureSize / 2}>
                <Stack gap={4}>
                    <Text fw={700} size="xl" style={{ lineHeight: 1.2 }}>
                        {data.user.displayName}
                    </Text>
                    <Text c="dimmed" style={{ lineHeight: 1 }}>@{data.user.username}</Text>
                </Stack>

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    {data.user.bio}
                </Text>

                <Text mt={4} c="dimmed" style={{ lineHeight: 1.4 }}>Profil vytvorený {moment(data.user.createdAt).format("D. M. yyyy")}</Text>

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