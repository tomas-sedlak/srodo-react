import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Box, Text, Group, Avatar, Loader, Stack } from '@mantine/core';
import { PostButtons, PostMenu } from 'templates/PostWidgets';
import Comments from "templates/Comments";
import axios from "axios";
import moment from "moment";

export default function Post() {
    const { postId } = useParams();

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`)
        return post.data
    }

    const { data, status } = useQuery({
        queryFn: fetchPost,
        queryKey: ["post", postId],
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <Box py="sm" px="md" className="border-bottom">
                <Box pos="relative" mb="sm">
                    <Group gap="xs">
                        <Link to={`/${data.author.username}`}>
                            <Avatar src={data.author.profilePicture} />
                        </Link>

                        <Stack gap={4} pr={32} style={{ flex: 1 }}>
                            <Link to={`/${data.author.username}`}>
                                <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                    {data.author.displayName}
                                </Text>
                            </Link>

                            <Group gap={4}>
                                <Link to={`/${data.author.username}`}>
                                    <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                        @{data.author.username}
                                    </Text>
                                </Link>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    &middot;
                                </Text>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    {moment(data.createdAt).fromNow()}
                                </Text>
                            </Group>
                        </Stack>
                    </Group>

                    <PostMenu post={data} />

                    <Box my="sm" style={{ whiteSpace: "pre-line" }}>
                        {data.content}
                    </Box>

                    <PostButtons post={data} />
                </Box>
            </Box>

            <Comments comments={data.comments} postId={postId} />
        </>
    )
}