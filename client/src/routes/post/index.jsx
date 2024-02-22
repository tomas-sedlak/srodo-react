import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, Button } from '@mantine/core';
import { Link } from "react-router-dom";
import axios from "axios";
import Comments from "templates/Comments";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Post() {
    const { postId } = useParams();
    const [post, setPost] = useState([]);

    const addView = async () => {
        await axios.patch(`/api/post/${postId}/view`)
    }

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`)
        setPost(post.data)
    }

    useEffect(() => {
        fetchPost()

        const timeoutId = setTimeout(() => {
            addView()
        }, 10000)

        return () => clearTimeout(timeoutId)
    }, [])

    return (
        <>
            <Box p="sm" className="border-bottom">
                <AspectRatio ratio={2 / 1}>
                    <Box className="lazy-image" style={{ backgroundImage: `url(${post.coverImage})` }}></Box>
                </AspectRatio>

                <Group gap="sm" align="center" mt="sm" wrap="nowrap">
                    <Avatar src={post.author?.profilePicture} />

                    <Group gap={4}>
                        <Link to="username">
                            <Text fw={600} c="gray" size="sm">
                                {post.author?.displayName}
                            </Text>
                        </Link>
                        <Text c="gray" size="sm">
                            &middot; {post.subject?.label} &middot; {moment(post.createdAt).fromNow()}
                        </Text>
                    </Group>
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

            <Comments comments={post.comments} postId={postId} />
        </>
    )
}