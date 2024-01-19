import { forwardRef } from "react";
import { useState } from 'react';
import { useMutation } from "@tanstack/react-query";
import { AspectRatio, Group, Image, Text, Avatar, Box } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import axios from "axios";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

const Post = forwardRef(({ post }, ref) => {
    const [liked, setLiked] = useState(post.liked);
    const [saved, setSaved] = useState(post.saved);
    const url = "/" + post.author.username + "/" + post._id;

    const handleLikeButton = async (event) => {
        event.preventDefault()
        console.log(likeMutation)
        await likeMutation.mutateAsync(post._id)
        // setLiked(!liked)

        // fetch(`${import.meta.env.VITE_API_URL}/post/${post._id}/like`, {
        //     method: "PUT",
        //     headers: { 'Content-Type': 'application/json' },
        //     cors: "no-cors",
        //     body: JSON.stringify({ userId: "65a971b4abd72acd1db48cc2" }),
        // })
    }

    const likePost = async (postId) => {
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/post/${postId}/like`, postId);
        return response.data;
    }

    const likeMutation = useMutation({
        mutationFn: likePost
    })

    const handleSaveButton = async (event) => {
        event.preventDefault()
        setSaved(!saved)

        fetch(`${import.meta.env.VITE_API_URL}/user/65a971b4abd72acd1db48cc2/saves`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            cors: "no-cors",
            body: JSON.stringify({ postId: post._id }),
        })
    }

    const postContent = (
        <Link to={url}>
            <Box key={post._id} className="border-bottom" p="sm">
                <AspectRatio ratio={2 / 1}>
                    <Image radius="lg" src={post.coverImage} />
                </AspectRatio>

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
                                &middot; Článok &middot; {moment(post.createdAt).fromNow()}
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
                                    className={`icon-wrapper ${liked ? "like-selected" : "like"}`}
                                    onClick={handleLikeButton}>
                                    {liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                    <span>{post.likesCount}</span>
                                </div>

                                {/* Comments button */}
                                <div className="icon-wrapper">
                                    <IconMessageCircle stroke={1.25} />
                                    <span>{post.commentsCount}</span>
                                </div>

                                {/* Save button */}
                                <div
                                    className={`icon-wrapper ${saved ? "save-selected" : "save"}`}
                                    onClick={handleSaveButton}>
                                    {saved ? <IconBookmarkFilled stroke={1.25} /> : <IconBookmark stroke={1.25} />}
                                    <span>{saved ? "Uložené" : "Uložiť"}</span>
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