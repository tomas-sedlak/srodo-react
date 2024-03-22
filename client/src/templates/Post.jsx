import { forwardRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AspectRatio, Group, Text, Avatar, Box, Badge, ActionIcon, Menu } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconEye, IconDots, IconTrash, IconPencil, IconChartBar, IconFlag } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { modals } from "@mantine/modals";
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
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(userId));

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const likePost = async () => {
        isLiked ? setLikes(likes - 1) : setLikes(likes + 1)
        setIsLiked(!isLiked)
        await axios.patch(
            `/api/post/${post._id}/like`, { userId }, { headers },
        )
    }

    const deletePost = async () => {
        const response = await axios.delete(
            `/api/post/${post._id}`, { headers },
        );
        return await response.data;
    }

    const deleteMutation = useMutation({
        mutationFn: deletePost,
        onSuccess: () => {
            queryClient.invalidateQueries("posts")
        },
    })

    const postContent = (
        <Box key={post._id} className="border-bottom light-hover" p="sm">
            <Box pos="relative">
                <Badge
                    className="image-item-left"
                    color="rgba(0, 0, 0, 0.4)"
                    c="white"
                >
                    {typeNames[post.postType]}
                </Badge>
                <Link to={url}>
                    <AspectRatio ratio={2 / 1}>
                        <Box className="lazy-image" style={{ backgroundImage: `url(${post.coverImage})` }}></Box>
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
                                className="dots"
                                variant="subtle"
                                color="gray"
                                c="text"
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
                                    <Menu.Item
                                        onClick={() => navigate(`${url}/upravit`)}
                                        leftSection={<IconPencil stroke={1.25} />}
                                    >
                                        <Text>Upraviť</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => navigate(`/statistiky/${post._id}`)}
                                        leftSection={<IconChartBar stroke={1.25} />}
                                    >
                                        <Text>Štatistiky</Text>
                                    </Menu.Item>

                                    <Menu.Divider />

                                    <Menu.Item
                                        color="red"
                                        onClick={() => modals.openConfirmModal({
                                            title: "Zmazať príspevok",
                                            children: <Text>Určite chceš zmazať tento príspevok?</Text>,
                                            centered: true,
                                            labels: { confirm: "Zmazať", cancel: "Zrušiť" },
                                            confirmProps: { color: "red" },
                                            onConfirm: () => deleteMutation.mutate(),
                                        })}
                                        leftSection={<IconTrash stroke={1.25} />}
                                    >
                                        <Text>Odstrániť</Text>
                                    </Menu.Item>
                                </>
                            ) : (
                                <Menu.Item leftSection={<IconFlag stroke={1.25} />}>
                                    <Text>Nahlásiť</Text>
                                </Menu.Item>
                            )}
                        </Menu.Dropdown>
                    </Menu>

                    <Group gap={4} align="center" pr={28} c="dimmed">
                        <Link to={"/" + post.author.username}>
                            <Text fw={700} size="sm" c="dimmed">
                                {post.author.displayName}
                            </Text>
                        </Link>
                        <Text size="sm">
                            &middot;
                        </Text>
                        <Link to={`/predmety/${post.subject.url}`}>
                            <Text size="sm" c="dimmed">
                                {post.subject.label}
                            </Text>
                        </Link>
                        <Text size="sm">
                            &middot;
                        </Text>
                        <Text size="sm">
                            {moment(post.createdAt).fromNow()}
                        </Text>
                    </Group>

                    <Link to={url}>
                        <Text
                            fw={800}
                            fz={24}
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
                                    if (userId) likePost()
                                    else dispatch(setLoginModal(true))
                                }}
                            >
                                {isLiked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                <span>{likes}</span>
                            </div>

                            {/* Comments button */}
                            <Link to={`${url}#komentare`} className="icon-wrapper">
                                <IconMessageCircle stroke={1.25} />
                                <span>{post.comments}</span>
                            </Link>
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