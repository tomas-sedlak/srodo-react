import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Box, Text, Group, Avatar, Loader, Stack } from '@mantine/core';
import { DownloadFile, PostButtons, PostMenu } from 'templates/PostWidgets';
import ImagesDisplay from "templates/ImagesDisplay";
import Comments from "templates/Comments";
import moment from "moment";
import axios from "axios";

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
            <Box py="sm" px="md" pos="relative" className="border-bottom">
                <Group gap="xs">
                    <Link to={`/${data.author.username}`}>
                        <Avatar src={data.author.profilePicture?.thumbnail} />
                    </Link>

                    <Stack gap={4} pr={32} style={{ flex: 1 }}>
                        <Group gap={4}>
                            <Link to={`/${data.author.username}`}>
                                <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                    {data.author.displayName}
                                </Text>
                            </Link>
                            <Link to={`/${data.author.username}`}>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    @{data.author.username}
                                </Text>
                            </Link>
                        </Group>

                        <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                            {moment(data.createdAt).fromNow()}
                        </Text>
                    </Stack>
                </Group>

                <PostMenu post={data} />

                <Box mt="sm" style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                    {data.content}
                </Box>

                <ImagesDisplay mt="sm" images={data.images} />

                {data.files.length > 0 &&
                    <Stack mt="sm" gap={4}>
                        {data.files.map(file =>
                            <DownloadFile file={file} />
                        )}
                    </Stack>
                }

                <PostButtons mt="sm" post={data} />
            </Box>

            <Comments comments={data.comments} postId={postId} />
        </>
    )
}