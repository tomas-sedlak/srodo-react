import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, TextInput, ActionIcon, Flex, Paper, UnstyledButton, Collapse, Textarea, Card, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSend, IconHeart, IconHeartFilled, IconMessageCircle } from '@tabler/icons-react';
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
            <Box p="sm">
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

                <Flex w="100%" gap="sm" pb="sm">
                    <Avatar />
                    <Textarea
                        autosize
                        w="100%"
                        placeholder="Tu mi napíš niečo pekné"
                        color="gray.1"
                        radius="lg"
                        rightSection={
                            <ActionIcon radius="lg"
                                variant="default"
                            >
                                <IconSend stroke={1.25} />
                            </ActionIcon>
                        }
                        styles={{
                            input: {
                                overflow: "hidden"
                            },
                            rightSection: {
                                // The send icon is always in the middle, I don't know if it's a good or bad thing, maybe make it stany at the top?
                            },
                        }}
                    />
                </Flex>

                {/* Comment head section, displayname etc. */}

                <Flex gap={4} align="flex-start" mt="sm" w="100%" pb="lg" >

                    <Avatar />

                    <Card withBorder w="100%" bg="gray.1" radius="lg">

                        {/* Group for commenter profile */}

                        <Group>

                            <Link to="username">
                                <Text fw={600} c="gray" size="sm">
                                    Display name
                                </Text>
                            </Link>
                            <Text c="gray" size="sm"> 
                                &middot; pred 13 min {/* There is some space (padding?) before the middot. FIX it later */}
                            </Text>
                        </Group>
                        <Text pt="sm" >Awesome comment</Text>

                        {/* Likes button */}
                        <Flex w="100%" >

                            <div
                                className={`icon-wrapper ${liked ? "like-selected" : "like"}`}
                                onClick={(event) => { event.preventDefault(); setLiked(!liked) }}>
                                {liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                {/* <span>{liked ? post.likes.length + 1 : post.likes.length}</span> */}
                            </div>

                            {/* Answer button */}
                            <Flex justify="flex-end" w="100%">
                                <UnstyledButton onClick={toggle} c="gray" >Odpovedat</UnstyledButton>
                            </Flex>
                        </Flex>

                    </Card>
                </Flex>

                {/* Answers to comments */}

                <Collapse in={openned} pt="sm" ml="md">
                    <Flex w="100%" gap="sm" pb="sm">
                        <Avatar />
                        <Textarea
                            autosize
                            w="100%"
                            placeholder="Tu mi napíš niečo pekné"
                            color="gray.1"
                            radius="lg"
                            rightSection={
                                <ActionIcon radius="lg"
                                    variant="default"
                                >
                                    <IconSend stroke={1.25} />
                                </ActionIcon>
                            }
                            styles={{
                                input: {
                                    overflow: "hidden"
                                },
                                rightSection: {
                                    // The send icon is always in the middle, I don't know if it's a good or bad thing, maybe make it stany at the top?
                                },
                            }}
                        />
                    </Flex>

                    {/* Comment head section, displayname etc. */}

                    <Flex gap={4} align="flex-start" mt="sm" w="100%" pb="lg" >

                        <Avatar />

                        <Card withBorder w="100%" bg="gray.1" radius="lg">

                            {/* Group for commenter profile */}

                            <Group>

                                <Link to="username">
                                    <Text fw={600} c="gray" size="sm">
                                        Display name
                                    </Text>
                                </Link>
                                <Text c="gray" size="sm">
                                    &middot; pred 13 min
                                </Text>
                            </Group>
                            <Text pt="sm" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos est necessitatibus asperiores quas ut veritatis, adipisci provident voluptatibus temporibus nobis soluta assumenda sit magnam atque, voluptatem tenetur laudantium aut sapiente!</Text>

                            {/* Likes button */}
                            <Flex w="100%" >

                                <div
                                    className={`icon-wrapper ${liked ? "like-selected" : "like"}`}
                                    onClick={(event) => { event.preventDefault(); setLiked(!liked) }}>
                                    {liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                    {/* <span>{liked ? post.likes.length + 1 : post.likes.length}</span> */}
                                </div>

                                {/* Answer button */}
                                <Flex justify="flex-end" w="100%">
                                    <UnstyledButton onClick={toggle} c="gray" >Odpovedat</UnstyledButton>
                                </Flex>
                            </Flex>

                        </Card>
                    </Flex>

                </Collapse>
            </Box>
        </>
    )
}

export function loader({ params }) {
    return [params.article];
}