import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { AspectRatio, Stack, Avatar, Text, Group, Image, Button, Box, Loader, Progress, Center, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Post from "templates/Post";
import axios from "axios";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function User() {
    const { username } = useParams();
    const [tab, setTab] = useState("posts");
    const isMobile = useMediaQuery("(max-width: 768px)");
    const profilePictureSize = isMobile ? 96 : 128;

    const getData = async () => {
        const user = await axios.get(`/api/user/${username}`);
        const posts = await axios.get(`/api/user/${user.data._id}/posts`);
        return { user: user.data, posts: posts.data }
    }

    const { data, status } = useQuery({
        queryFn: getData,
        queryKey: ["userPage", username],
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
                <Image src={data.user.coverImage} />
            </AspectRatio>

            <div style={{ position: "relative" }}>
                <Avatar
                    className="profile-picture"
                    size={profilePictureSize}
                    src={data.user.profilePicture}
                />
            </div>

            {!isMobile &&
                <Group ml={profilePictureSize + 8} h={profilePictureSize / 2} px="sm">
                    <Stack gap={4}>
                        <Text fw={700} size="xl" style={{ lineHeight: 1 }}>
                            {data.user.displayName}
                        </Text>
                        <Text c="dimmed" style={{ lineHeight: 1 }}>@{data.user.username}</Text>
                    </Stack>
                </Group>
            }

            <Box p="sm">
                {isMobile &&
                    <Stack mb="sm" mt={profilePictureSize / 2} gap={4}>
                        <Text fw={700} size="xl" style={{ lineHeight: 1 }}>
                            {data.user.displayName}
                        </Text>
                        <Text c="dimmed" style={{ lineHeight: 1 }}>@{data.user.username}</Text>
                    </Stack>
                }

                <Text style={{ lineHeight: 1.4 }}>
                    {data.user.bio}
                </Text>

                {/* Code for xp bar */}
                {/* <Group mt="sm">
                    <Box style={{ borderRadius: "var(--mantine-radius-xl)" }} bg="var(--mantine-color-srobarka-filled)" w={32} h={32} p={2}>
                        <Center>
                            <Text c="white" >4</Text>
                        </Center>
                    </Box>

                    <Progress size="lg" value={25} style={{ flex: 1 }} />
                    <Box style={{ borderRadius: "var(--mantine-radius-xl)" }} bg="var(--mantine-color-srobarka-filled)" w={32} h={32} p={2}>
                        <Center>
                            <Text c="white">5</Text>
                        </Center>
                    </Box>
                </Group> */}

                <Text mt={4} c="dimmed">Profil vytvorený {moment(data.user.createdAt).format("D. M. yyyy")}</Text>

                <Group mt={8} gap={4}>
                    <div className="icon-wrapper">
                        <img width={24} height={24} src="socials/youtube.svg" />
                        <span>username</span>
                    </div>

                    <div className="icon-wrapper">
                        <img width={24} height={24} src="socials/instagram.svg" />
                        <span>username</span>
                    </div>
                </Group>
            </Box>

            <Tabs px="sm" className="border-bottom" variant="unstyled" value={tab} onChange={setTab}>
                <Tabs.List className="custom-tabs">
                    <Tabs.Tab value="posts">
                        Príspevky
                    </Tabs.Tab>
                    <Tabs.Tab value="groups">
                        Skupiny
                    </Tabs.Tab>
                    <Tabs.Tab value="badges">
                        Odznaky
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {data.posts.length === 0 && (
                <Text px="sm" py="lg" c="dimmed">Zatiaľ žiadne príspevky</Text>
            )}

            {data.posts.map((post) => <Post post={post} />)}
        </>
    );
}