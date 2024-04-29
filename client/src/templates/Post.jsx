import { forwardRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Group, Text, Avatar, ActionIcon, Menu, Stack, Spoiler } from '@mantine/core';
import { IconDots, IconTrash, IconPencil, IconChartBar, IconFlag, IconMessageCircle, IconHeart, IconShare, IconHeartFilled } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import { setLoginModal } from "state";
import axios from "axios";
import moment from "moment";

const Post = forwardRef(({ post }, ref) => {
    const authorUrl = `/${post.author.username}`;
    const postUrl = `${authorUrl}/prispevok/${post._id}`;
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(userId));

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const likePost = async () => {
        isLiked ? setLikes(likes - 1) : setLikes(likes + 1)
        setIsLiked(!isLiked)
        await axios.patch(
            `/api/post/${post._id}/like`, {}, { headers },
        )
    }

    const postContent = (
        <Link to={postUrl}>
            <Group px="md" py="sm" gap="xs" align="flex-start" className="border-bottom">
                <Link to={authorUrl}>
                    <Avatar src={post.author.profilePicture} />
                </Link>

                <PostMenu post={post} />

                <Stack gap={4} pos="relative" style={{ flex: 1 }}>
                    <Group gap={4}>
                        <Link to={"/" + post.author.username}>
                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                {post.author.displayName}
                            </Text>
                        </Link>
                        {/* {post.author._id === owner._id &&
                            <Badge variant="light" size="xs">Admin</Badge>
                        } */}
                        <Link to={"/" + post.author.username}>
                            <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                                @{post.author.username}
                            </Text>
                        </Link>
                        <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                            &middot;
                        </Text>
                        <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                            {moment(post.createdAt).fromNow()}
                        </Text>
                    </Group>

                    <Spoiler
                        maxHeight={100}
                        hideLabel="Zobraziť menej"
                        showLabel="Zobraziť viac"
                        styles={{
                            control: { color: "var(--mantine-color-dimmed)" },
                        }}
                    >
                        <div style={{ whiteSpace: "pre-line" }}>
                            {post.content}
                        </div>
                    </Spoiler>

                    <Group gap={8}>
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

                        <HashLink to={`${postUrl}#komentare`} className="icon-wrapper">
                            <IconMessageCircle stroke={1.25} />
                            <span>{post.comments}</span>
                        </HashLink>

                        <div className="icon-wrapper">
                            <IconShare stroke={1.25} />
                            <span>Zdieľať</span>
                        </div>
                    </Group>
                </Stack>
            </Group>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})


const PostMenu = ({ post }) => {
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const deletePost = async () => {
        await axios.delete(`/api/post/${post._id}`, { headers });
        queryClient.invalidateQueries("posts");
    }

    return (
        <Menu position="bottom-end" width={180}>
            <Menu.Target>
                <ActionIcon
                    className="dots"
                    variant="subtle"
                    color="gray"
                    c="var(--mantine-color-text)"
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
                                onConfirm: deletePost,
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
    )
}

export default Post