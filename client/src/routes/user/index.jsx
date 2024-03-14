import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";
import { AspectRatio, Stack, Avatar, Text, Group, Image, Button, Box, Loader } from "@mantine/core";
import { IconBrandDiscord, IconBrandYoutube } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Post from "templates/Post";
import axios from "axios";

export default function User() {
    const { username } = useParams();
    const [following, setFollowing] = useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

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
                <Image src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?w=600" />
            </AspectRatio>

            <Box px="sm" pb="sm" className="border-bottom">
                <div style={{ position: "relative" }}>
                    <Avatar
                        className="profile-picture"
                        size={100}
                        src={data.user.profilePicture}
                    />
                </div>

                <Group ml={108} mt={8} mb="sm" justify={isMobile ? "flex-end" : "space-between"}>
                    {!isMobile &&
                        <Stack gap={4}>
                            <Text fw={700} size="lg" style={{ lineHeight: 1 }}>
                                {data.user.displayName}
                            </Text>
                            <Text size="sm" c="gray" style={{ lineHeight: 1 }}>@{data.user.username}</Text>
                        </Stack>
                    }

                    <Button variant={following ? "light" : "filled"} onClick={() => setFollowing(!following)}>
                        {following ? "Sledované" : "Sledovať"}
                    </Button>
                </Group>

                {isMobile &&
                    <Stack mb="sm" gap={4}>
                        <Text fw={700} size="lg" style={{ lineHeight: 1 }}>
                            {data.user.displayName}
                        </Text>
                        <Text size="sm" c="gray" style={{ lineHeight: 1 }}>@{data.user.username}</Text>
                    </Stack>
                }

                <Text style={{ lineHeight: 1.4 }}>
                    Kratky text o mne a mojich zaujmoch.
                </Text>

                <Group mt={8}>
                    <Group gap={4}>
                        <Text fw={700} style={{ lineHeight: 1 }}>{data.posts.length}</Text>
                        <Text c="gray" style={{ lineHeight: 1 }}>Príspevkov</Text>
                    </Group>
                    <Group gap={4}>
                        <Text fw={700} style={{ lineHeight: 1 }}>0</Text>
                        <Text c="gray" style={{ lineHeight: 1 }}>Sledovateľov</Text>
                    </Group>
                </Group>

                <Group mt="sm" gap={8}>
                    <div className="icon-wrapper">
                        <IconBrandDiscord stroke={1.25} />
                        <span>username</span>
                    </div>

                    <div className="icon-wrapper">
                        <IconBrandYoutube stroke={1.25} />
                        <span>username</span>
                    </div>
                </Group>
            </Box>

            {data.posts.map((post) => <Post post={post} />)}
        </>
    );
}