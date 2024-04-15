import { forwardRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AspectRatio, Group, Text, Avatar, Box, Badge, ActionIcon, Menu, Stack } from '@mantine/core';
import { IconDots, IconTrash, IconPencil, IconChartBar, IconFlag } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { modals } from "@mantine/modals";
import axios from "axios";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
import { PostButtons } from "./PostWidgets";
moment.locale("sk");

const typeNames = {
    article: "Článok",
    quiz: "Kvíz",
    discussion: "Diskusia",
}

const Post = forwardRef(({ post }, ref) => {
    const queryClient = useQueryClient();
    const url = `/${post.author.username}/prispevok/${post._id}`;
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${token}`,
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
        <Box key={post._id} className="border-bottom light-hover" py="sm" px="md">
            <Box pos="relative">
                <Badge fw={600} className="image-item-left">
                    {typeNames[post.postType]}
                </Badge>

                <Link to={url}>
                    <AspectRatio ratio={2 / 1}>
                        <Box className="lazy-image" style={{ backgroundImage: `url(${post.coverImage})` }}></Box>
                    </AspectRatio>
                </Link>
            </Box>

            {/* Post information */}
            <Box mt="sm" pos="relative">
                <Group gap="xs">
                    <Link to={`/${post.author.username}`}>
                        <Avatar src={post.author.profilePicture} />
                    </Link>

                    <Stack gap={4} pr={32} style={{ flex: 1 }}>
                        <Link to={"/" + post.author.username}>
                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                {post.author.displayName}
                            </Text>
                        </Link>

                        <Group gap={4}>
                            <Link to={`/predmety/${post.subject.url}`}>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    {post.subject.label}
                                </Text>
                            </Link>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                &middot;
                            </Text>
                            <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                {moment(post.createdAt).fromNow()}
                            </Text>
                        </Group>
                    </Stack>
                </Group>

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

                <Link to={url}>
                    <Text
                        mt={8}
                        fw={800}
                        fz={24}
                        style={{ lineHeight: 1.2 }}
                        lineClamp={2}
                    >
                        {post.title}
                    </Text>
                </Link>

                <PostButtons post={post} />
            </Box>
        </Box>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post