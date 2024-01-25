import { forwardRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AspectRatio, Group, Image, Text, Avatar, Box, Badge } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import axios from "axios";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

const typeNames = {
    article: "Článok",
    quizz: "Kvíz",
    discussion: "Diskusia",
}

const Post = forwardRef(({ post }, ref) => {
    const queryClient = useQueryClient();
    const url = "/" + post.author.username + "/" + post._id;
    const userId = "65b1848bfbb5fbbc9cda4acd";

    const likePost = async (postId) => {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/post/${postId}/like`, { userId });
        return response.data;
    }

    const savePost = async (postId) => {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/user/${userId}/saved`, { postId });
        return response.data;
    }

    const likeMutation = useMutation({
        mutationFn: likePost,
        onSuccess: () => {
            queryClient.invalidateQueries("posts")
        },
    })

    const saveMutation = useMutation({
        mutationFn: savePost,
        onSuccess: () => {
            queryClient.invalidateQueries("posts")
        },
    })

    const postContent = (
        <Link to={url}>
            <Box key={post._id} className="border-bottom" p="sm">
                <Box pos="relative">
                    <Badge
                        className="image-item-left"
                        color="black"
                        c="white"
                        variant="light"
                    >
                        {typeNames[post.postType]}
                    </Badge>
                    <AspectRatio ratio={2 / 1}>
                        <Image radius="lg" src={post.coverImage} />
                    </AspectRatio>
                </Box>

                {/* Post information */}
                <Group align="flex-start" wrap="nowrap" mt="sm" gap="sm">
                    <Link to={"/" + post.author.username}>
                        <Avatar src={post.author.profilePicture} />
                    </Link>

                    <div>
                        <Group gap={4} align="center">
                            <Link to={"/" + post.author.username}>
                                <Text fw={600} c="gray" size="sm">
                                    {post.author.displayName}
                                </Text>
                            </Link>
                            <Text c="gray" size="sm">
                                &middot; {moment(post.createdAt).fromNow()}
                            </Text>
                        </Group>

                        <Text
                            fw={800}
                            fz={24}
                            underline="never"
                            style={{ lineHeight: 1.2 }}
                            lineClamp={2}
                        >
                            {post.title}
                        </Text>

                        <Group justify="space-between" mt="sm">
                            <Group gap={8}>

                                {/* Likes button */}
                                <div
                                    className={`icon-wrapper ${post.liked ? "like-selected" : "like"}`}
                                    onClick={event => {
                                        event.preventDefault()
                                        likeMutation.mutate(post._id)
                                    }}
                                >
                                    {post.liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                    <span>{userId ? post.likesCount : "login"}</span>
                                </div>

                                {/* Comments button */}
                                <Link to={url + "#komentare"} className="icon-wrapper">
                                    <IconMessageCircle stroke={1.25} />
                                    <span>{post.commentsCount}</span>
                                </Link>

                                {/* Save button */}
                                <div
                                    className={`icon-wrapper ${post.saved ? "save-selected" : "save"}`}
                                    onClick={event => {
                                        event.preventDefault()
                                        saveMutation.mutate(post._id)
                                    }}
                                >
                                    {post.saved ? <IconBookmarkFilled stroke={1.25} /> : <IconBookmark stroke={1.25} />}
                                    <span>{post.saved ? "Uložené" : "Uložiť"}</span>
                                </div>

                            </Group>
                        </Group>
                    </div>
                </Group>
            </Box>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post