import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { AspectRatio, Box, Text, Group, Title, TypographyStylesProvider, Avatar, Loader } from '@mantine/core';
import { Link } from "react-router-dom";
import { PostButtons } from 'templates/PostWidgets';
import axios from "axios";
import Comments from "templates/Comments";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
import { useQuery } from '@tanstack/react-query';
moment.locale("sk");

export default function Post() {
    const { postId } = useParams();

    const addView = async () => {
        await axios.patch(`/api/post/${postId}/view`)
    }

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`)
        return post.data
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            addView()
        }, 10000)

        return () => clearTimeout(timeoutId)
    }, [])

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
            <Box p="sm" className="border-bottom">
                <AspectRatio ratio={2 / 1}>
                    <Box
                        className="lazy-image"
                        style={{ backgroundImage: `url(${data.coverImage})` }}
                    ></Box >
                </AspectRatio >

                <Group gap="sm" mt="sm" wrap="nowrap">
                    <Avatar src={data.author.profilePicture} />

                    <Group gap={4} c="dimmed">
                        <Link to={"/" + data.author.username}>
                            <Text fw={600} size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                {data.author.displayName}
                            </Text>
                        </Link>
                        <Text size="sm" style={{ lineHeight: 1 }}>
                            &middot;
                        </Text>
                        <Link to={`/predmety/${data.subject.url}`}>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                {data.subject.label}
                            </Text>
                        </Link>
                        <Text size="sm" style={{ lineHeight: 1 }}>
                            &middot;
                        </Text>
                        <Text size="sm" style={{ lineHeight: 1 }}>
                            {moment(data.createdAt).fromNow()}
                        </Text>
                    </Group>
                </Group>

                <Title
                    fw={800}
                    fz={32}
                    mt="sm"
                    style={{ lineHeight: 1.2 }}
                >
                    {data.title}
                </Title>

                <PostButtons post={data} />

                <TypographyStylesProvider p={0} mt="sm">
                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                </TypographyStylesProvider>
            </Box >

            <Comments comments={data.comments} postId={postId} />
        </>
    )
}