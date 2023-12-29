import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { Card, AspectRatio, Image, Text, Group, Title, TypographyStylesProvider, Avatar, Box, Tooltip } from '@mantine/core';
import { Link } from "react-router-dom";
import Profile from "../templates/profile";
import Header from "../templates/header";

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
            <Header title="Príspevok" arrowBack />

            <Card className="custom-card" padding="lg" mt={8} mb="md">
                <Card.Section>
                    <AspectRatio ratio={10 / 4}>
                        <Image src={post.image + "?w=600"} />
                    </AspectRatio>
                </Card.Section>

                <Group align="flex-start" wrap="nowrap" mt="md" gap="sm">
                    <Avatar />

                    <Box w="100%">
                        <Group gap={4} align="flex-start">
                            <Link to="username">
                                <Text fw={700} size="sm">
                                    Display name
                                </Text>
                            </Link>
                            <Text
                                c="gray"
                                size="sm"
                            >
                                &middot;
                            </Text>
                            <Text
                                c="gray"
                                size="sm"
                            >
                                Biologia
                            </Text>
                            <Text
                                c="gray"
                                size="sm"
                            >
                                &middot;
                            </Text>
                            <Tooltip label="12:20 18. Decembra 2023" openDelay={600}>
                                <Text
                                    c="gray"
                                    size="sm"
                                >
                                    20m
                                </Text>
                            </Tooltip>
                        </Group>

                        <Title
                            fw={800}
                            fz={32}
                            mb="sm"
                            style={{ lineHeight: 1.2 }}
                        >
                            {post.title}
                        </Title>

                        <TypographyStylesProvider p={0} m={0}>
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </TypographyStylesProvider>
                    </Box>
                </Group>

                {/* <Group mt="lg" mb="sm" gap="xs">
                    <Profile user={user} />
                </Group> */}



                {/* <Box mb="lg">
                    <Tags tags={post.tags} />
                </Box> */}

                {/* <Text c="gray" size="sm" mb="lg">
                    {"Vytvorené " + moment(post.createdAt).fromNow()} &middot; */}
                    {/* {post.createdAt != post.updatedAt && "Upravené " + moment(post.updatedAt).fromNow()} &middot; */}
                    {/* 13 min read &middot;
                    Biology
                </Text>

                <Title
                    fw={800}
                    fz={32}
                    mb="sm"
                    style={{ lineHeight: 1.2 }}
                >
                    {post.title}
                </Title>

                <TypographyStylesProvider>
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </TypographyStylesProvider> */}

            </Card>
        </>
    )
}

export function loader({ params }) {
    return [params.username, params.article];
}