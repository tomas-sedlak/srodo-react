import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar } from '@mantine/core';
import { Link } from "react-router-dom";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Article() {
    const [username, article] = useLoaderData();
    const [user, setUser] = useState([])
    const [post, setPost] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/content/article?id=" + article)
            .then(result => result.json())
            .then(data => setPost(data))

        fetch("http://localhost:3000/user?username=" + username)
            .then(result => result.json())
            .then(data => setUser(data))
    }, [])

    return (
        <>
            <Box p="sm">
                <AspectRatio ratio={10 / 4}>
                    <Image radius="lg" src={post.image + "?w=600"} />
                </AspectRatio>

                <Group gap={4} align="center" mt="sm">
                    <Avatar />

                    <Link to="username">
                        <Text fw={600} c="gray" size="sm">
                            Display name
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; Článok &middot; {moment(post.createdAt).fromNow()}
                    </Text>
                </Group>

                <Title
                    fw={800}
                    fz={32}
                    mt="sm"
                    style={{ lineHeight: 1.2 }}
                >
                    {post.title}
                </Title>

                <TypographyStylesProvider p={0} mt="sm">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </TypographyStylesProvider>
            </Box>

            {/* TODO: add comment section */}
        </>
    )
}

export function loader({ params }) {
    return [params.username, params.article];
}