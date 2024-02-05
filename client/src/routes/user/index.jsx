import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { AspectRatio, Stack, Avatar, Text, Group, Image, Button, Box } from '@mantine/core';
import { IconBrandDiscord, IconBrandYoutube } from '@tabler/icons-react';
import Post from "templates/post";
import axios from 'axios';

export default function User() {
    const { username } = useParams();
    const [following, setFollowing] = useState(false);
    const [user, setUser] = useState([])
    const [posts, setPosts] = useState([])

    const getData = async () => {
        const user = await axios.get(`${import.meta.env.VITE_API_URL}/user/${username}`);
        const posts = await axios.get(`${import.meta.env.VITE_API_URL}/user/${user.data._id}/posts`);
        setUser(user.data);
        setPosts(posts.data);
    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <>
            <Box p="sm" className="border-bottom">
                <AspectRatio ratio={1000 / 280}>
                    <Image radius="lg" src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?w=600" />
                </AspectRatio>

                <div style={{ position: "relative" }}>
                    <Avatar
                        className="profile-picture"
                        size={100}
                        src={user.profilePicture}
                    />
                </div>

                <Group ml={120} mt={8} mb="sm" justify="space-between">
                    <Stack gap={4}>
                        <Text fw={700} size="lg" style={{ lineHeight: 1 }}>
                            {user.displayName}
                        </Text>
                        <Text size="sm" c="gray" style={{ lineHeight: 1 }}>@{user.username}</Text>
                    </Stack>

                    <Button variant={following ? "light" : "filled"} onClick={() => setFollowing(!following)}>
                        {following ? "Sledované" : "Sledovať"}
                    </Button>
                </Group>

                <Text style={{ lineHeight: 1.4 }}>
                    Kratky text o mne a mojich zaujmoch.
                </Text>

                <Group mt={8}>
                    <Group gap={4}>
                        <Text fw={700} style={{ lineHeight: 1 }}>{posts.length}</Text>
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

            {posts.map((post) => <Post post={post} />)}
        </>
    );
}