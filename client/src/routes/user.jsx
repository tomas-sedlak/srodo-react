import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Card, Box, Avatar, Text, Group, Button } from '@mantine/core';
import { IconCalendar, IconBrandDiscord, IconBrandYoutube } from '@tabler/icons-react';
import Post from "../templates/post";

export default function User() {
    const username = useLoaderData();
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/")
            .then(response => response.json())
            .then(posts => setPosts(posts))
    }, [])

    return (
        <>
            <Card padding="lg" radius="md" mb="sm" withBorder>
                <Card.Section>
                    <AspectRatio ratio={10 / 2}>
                        {/* <Image src="https://images.pexels.com/photos/11554408/pexels-photo-11554408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" /> */}
                        <Box bg="blue.1"></Box>
                    </AspectRatio>
                </Card.Section>

                <div style={{ position: "relative" }}>
                    <Avatar
                        className="profile-picture"
                        size={128}
                        src="https://play-lh.googleusercontent.com/C9CAt9tZr8SSi4zKCxhQc9v4I6AOTqRmnLchsu1wVDQL0gsQ3fmbCVgQmOVM1zPru8UH=w240-h480-rw"
                    />
                </div>

                <Group h={64} justify="flex-end">
                    <Button>
                        Sledovat
                    </Button>
                </Group>

                <Text mt="sm" fw={700} size="xl" style={{ lineHeight: 1 }}>
                    Display Name
                </Text>
                <Text c="gray">@username</Text>

                <Text mt="sm" style={{ lineHeight: 1.4 }}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At, quae deserunt. Praesentium consequatur quo debitis quasi expedita. Dolor deserunt consequuntur nesciunt, quisquam beatae distinctio odio dolorem labore? Explicabo, quam optio.
                </Text>

                <Group mt="sm">
                    <Group gap={4}>
                        <IconCalendar color="gray" width="xs" />
                        <Text c="gray">Joined 1 month ago</Text>
                    </Group>
                    <Group gap={4}>
                        <IconBrandDiscord color="gray" width="xs" />
                        <Text c="gray">username</Text>
                    </Group>
                    <Group gap={4}>
                        <IconBrandYoutube color="gray" width="xs" />
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