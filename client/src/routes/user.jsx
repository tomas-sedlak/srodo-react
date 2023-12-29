import { useState, useEffect } from 'react';
import { useLoaderData, Link } from "react-router-dom";
import { AspectRatio, Card, Avatar, Text, Group, Image, Button, ActionIcon } from '@mantine/core';
import { IconArrowLeft, IconCalendar, IconBrandDiscord, IconBrandYoutube } from '@tabler/icons-react';
import Post from "../templates/post";
import Header from "../templates/header";

export default function User() {
    const username = useLoaderData();

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
            <Header title={user.displayName} arrowBack />

            <Card className="custom-card" padding="md" mb="sm">
                <Card.Section>
                    <AspectRatio ratio={1000 / 280}>
                        <Image src="https://images.pexels.com/photos/189349/pexels-photo-189349.jpeg?w=600" />
                        {/* <Box bg="blue.1"></Box> */}
                    </AspectRatio>
                </Card.Section>

                <div style={{ position: "relative" }}>
                    <Avatar
                        className="profile-picture"
                        size={128}
                        src={user.profilePicture}
                    />
                </div>

                <Group h={64} justify="flex-end">
                    <Button>
                        Sledovať
                    </Button>
                </Group>

                <Text mt="sm" fw={700} size="xl" style={{ lineHeight: 1 }}>
                    {user.displayName}
                </Text>
                <Text c="gray">@{user.username}</Text>

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At, quae deserunt. Praesentium consequatur quo debitis quasi expedita. Dolor deserunt consequuntur nesciunt, quisquam beatae distinctio odio dolorem labore? Explicabo, quam optio.
                </Text>

                <Group mt="sm">
                    <Group gap={4}>
                        <IconCalendar stroke={1.75} color="gray" style={{ width: 20, height: 20 }} />
                        <Text c="gray">Joined 1 month ago</Text>
                    </Group>
                    <Group gap={4}>
                        <IconBrandDiscord stroke={1.75} color="gray" style={{ width: 20, height: 20 }} />
                        <Text c="gray">username</Text>
                    </Group>
                    <Group gap={4}>
                        <IconBrandYoutube stroke={1.75} color="gray" style={{ width: 20, height: 20 }} />
                        <Text c="gray">username</Text>
                    </Group>
                </Group>
            </Card>

            {posts.map((post) => <Post post={post} />)}
        </>
    );
}

export function loader({ params }) {
    return params.username;
}