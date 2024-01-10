import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Stack, Avatar, Text, Group, Image, Button, Box } from '@mantine/core';
import { IconBrandDiscord, IconBrandYoutube } from '@tabler/icons-react';
import Post from "../templates/post";

export default function User() {
    const username = useLoaderData();

    const [following, setFollowing] = useState(false);
    const [user, setUser] = useState([])
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/user?username=" + username)
            .then(response => response.json())
            .then(data => setUser(data))

        fetch("http://localhost:3000/")
            .then(response => response.json())
            .then(data => setPosts(data))
    }, [])

    return (
        <>
            <Box p="sm" className="card">
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

                <Group ml={120} mt={8} justify="space-between">
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

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At, quae deserunt. Praesentium consequatur quo debitis quasi expedita. Dolor deserunt consequuntur nesciunt, quisquam beatae distinctio odio dolorem labore? Explicabo, quam optio.
                </Text>

                <Text mt="sm" fw={700} size="lg" style={{ lineHeight: 1 }}>Sociálne siete</Text>
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

export function loader({ params }) {
    return params.username;
}