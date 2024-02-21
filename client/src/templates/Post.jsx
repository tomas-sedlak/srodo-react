import { forwardRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AspectRatio, Group, Image, Text, Avatar, Box, Badge, ActionIcon, Menu } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconBookmark, IconBookmarkFilled, IconEye, IconDots, IconTrash, IconPencil, IconChartBar, IconFlag } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import axios from "axios";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

const typeNames = {
    article: "Článok",
    quiz: "Kvíz",
    discussion: "Diskusia",
}

const Post = forwardRef(({ post }, ref) => {
    const queryClient = useQueryClient();
    const url = `/${post.author.username}/${post._id}`;
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const isLiked = post.likes.includes(userId);
    const dispatch = useDispatch();

    const likePost = async () => {
        const response = await axios.patch(
            `/api/post/${post._id}/like`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    }

    const savePost = async (postId) => {
        const response = await axios.patch(
            `/api/user/${userId}/save`,
            { postId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return await response.data;
    }

    const likeMutation = useMutation({
        mutationFn: likePost,
        onSuccess: (updatePost) => {
            queryClient.setQueryData(["posts"], data => {
                return {
                    ...data,
                    pages: data.pages.map(page =>
                        page.map(post =>
                            post._id === updatePost._id ? updatePost : post
                        )
                    )
                }
            })
        },
    })

    const saveMutation = useMutation({
        mutationFn: savePost,
        onSuccess: () => {
            queryClient.invalidateQueries("posts")
        },
    })

    const deletePost = async () => {
        const response = await axios.delete(
            `/api/post/${post._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return await response.data;
    }

    const postContent = (
        <Box key={post._id} className="border-bottom light-hover" p="sm">
            <Box pos="relative">
                <Badge
                    className="image-item-left"
                    color="black"
                    c="white"
                    variant="light"
                >
                    {typeNames[post.postType]}
                </Badge>
                <Link to={url}>
                    <AspectRatio ratio={2 / 1}>
                        <Image radius="lg" src={post.coverImage} />
                    </AspectRatio>
                </Link>
            </Box>

            {/* Post information */}
            <Group align="flex-start" wrap="nowrap" mt="sm" gap="sm">
                <Link to={"/" + post.author.username}>
                    <Avatar src={post.author.profilePicture} />
                </Link>

                <Box pos="relative" w="100%">

                    <Menu position="bottom-end" width={180}>
                        <Menu.Target>
                            <ActionIcon
                                className="post-dots"
                                variant="subtle"
                                color="gray"
                                c="black"
                                radius="xl"
                                w={32}
                                h={32}
                            >
                                <IconDots stroke={1.25} style={{ width: 20, height: 20 }} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            {post.author._id === userId ? (
                                <>
                                    <Menu.Item>
                                        <Link to={`${url}/upravit`}>
                                            <Group>
                                                <IconPencil stroke={1.25} />
                                                <Text>Upraviť</Text>
                                            </Group>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Group>
                                            <IconChartBar stroke={1.25} />
                                            <Text>Štatistiky</Text>
                                        </Group>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item color="red">
                                        <Group onClick={deletePost}>
                                            <IconTrash stroke={1.25} />
                                            <Text>Odstrániť</Text>
                                        </Group>
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item>
                                    <Group>
                                        <IconFlag stroke={1.25} />
                                        <Text>Nahlásiť</Text>
                                    </Group>
                                </Menu.Item>
                            )}
                        </Menu.Dropdown>
                    </Menu>

                    <Group gap={4} align="center" pr={28}>
                        <Link to={"/" + post.author.username}>
                            <Text fw={600} c="gray" size="sm">
                                {post.author.displayName}
                            </Text>
                        </Link>
                        <Text c="gray" size="sm">
                            &middot;
                        </Text>
                        <Link to={post.subject.url}>
                            <Text c="gray" size="sm">
                                {post.subject.label}
                            </Text>
                        </Link>
                        <Text c="gray" size="sm">
                            &middot;
                        </Text>
                        <Text c="gray" size="sm">
                            {moment(post.createdAt).fromNow()}
                        </Text>
                    </Group>

                    <Link to={url}>
                        <Text
                            fw={800}
                            fz={24}
                            underline="never"
                            style={{ lineHeight: 1.2 }}
                            lineClamp={2}
                        >
                            {post.title}
                        </Text>
                    </Link>

                    <Group justify="space-between" mt="sm">
                        <Group gap={8}>
                            <div className="icon-wrapper">
                                <IconEye stroke={1.25} />
                                <span>{post.views.reduce((acc, view) => acc + view.count, 0)}</span>
                            </div>

                            {/* Likes button */}
                            <div
                                className={`icon-wrapper ${isLiked ? "like-selected" : "like"}`}
                                onClick={event => {
                                    event.preventDefault()
                                    if (userId) likeMutation.mutate()
                                    else dispatch(setLoginModal(true))
                                }}
                            >
                                {isLiked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                <span>{post.likes.length}</span>
                            </div>

                            {/* Comments button */}
                            <Link to={`${url}#komentare`} className="icon-wrapper">
                                <IconMessageCircle stroke={1.25} />
                                <span>{post.comments.length}</span>
                            </Link>

                            {/* Save button */}
                            <div
                                className={`icon-wrapper ${post.saved ? "save-selected" : "save"}`}
                                onClick={event => {
                                    event.preventDefault()
                                    if (userId) saveMutation.mutate(post._id)
                                    else dispatch(setLoginModal(true))
                                }}
                            >
                                {post.saved ? <IconBookmarkFilled stroke={1.25} /> : <IconBookmark stroke={1.25} />}
                                <span>{post.saved ? "Uložené" : "Uložiť"}</span>
                            </div>
                        </Group>
                    </Group>
                </Box>
            </Group>
        </Box>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post