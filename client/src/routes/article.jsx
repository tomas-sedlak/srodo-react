import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, TextInput, ActionIcon, Flex, Paper, UnstyledButton, Collapse, Textarea, Card, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSend, IconHeart, IconHeartFilled, IconMessageCircle } from '@tabler/icons-react';
import Comment from "../templates/comment"
import { Link } from "react-router-dom";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Article() {
    const [postId] = useLoaderData();
    const [post, setPost] = useState([])

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + "/post?id=" + postId)
            .then(result => result.json())
            .then(data => setPost(data))
    }, [])

    const [openned, { toggle }] = useDisclosure(false)
    const [liked, setLiked] = useState(false);

    return (
        <>
            <Box p="sm" className="border-bottom">
                <AspectRatio ratio={2 / 1}>
                    <Image radius="lg" src={post.coverImage} />
                </AspectRatio>

                <Group gap={4} align="center" mt="sm">
                    <Avatar src={post.author?.profilePicture} />

                    <Link to="username">
                        <Text fw={600} c="gray" size="sm">
                            {post.author?.displayName}
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; Clanok &middot; {moment(post.createdAt).fromNow()}
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

            <Box p="sm">

                {/* Adding new comments */}

                <Group align="flex-start" gap={8}>
                    <Avatar />

                    <Textarea
                        style={{ flex: 1 }}
                        placeholder="Tu mi napíš niečo pekné"
                        minRows={2}
                        autosize
                        radius="lg"
                        rightSection={
                            <ActionIcon
                                radius="xl"
                                variant="subtle"
                            >
                                <IconSend stroke={1.25} />
                            </ActionIcon>
                        }
                    />
                </Group>

                <Comment depth={0} />
                <Comment depth={1} />
                <Comment depth={2} />

            </Box>
        </>
    )
}

export function loader({ params }) {
    return [params.article];
}