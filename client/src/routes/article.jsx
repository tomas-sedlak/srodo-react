import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, ActionIcon, Textarea } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import Comment from "../templates/comment"
import { Link } from "react-router-dom";
import axios from "axios";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Article() {
    const [postId] = useLoaderData();
    const [post, setPost] = useState([]);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const userId = "65aaabe625c014aea920db03";

    const fetchPost = async () => {
        const post = await axios.get(import.meta.env.VITE_API_URL + "/post/" + postId)
        setPost(post.data)
    }

    const fetchComments = async () => {
        const comments = await axios.get(import.meta.env.VITE_API_URL + "/post/" + postId + "/comment")
        setComments(comments.data)
    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [])

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
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        rightSection={
                            <ActionIcon
                                radius="xl"
                                variant="subtle"
                                onClick={() => {
                                    axios.post(import.meta.env.VITE_API_URL + "/post/" + postId + "/comment", {
                                        postId: postId,
                                        userId: userId,
                                        content: comment,
                                    })
                                    fetchComments()
                                    setComment("")
                                }}
                            >
                                <IconSend stroke={1.25} />
                            </ActionIcon>
                        }
                    />
                </Group>

                {comments.map(comment => <Comment data={comment} />)}

            </Box>
        </>
    )
}

export function loader({ params }) {
    return [params.article];
}