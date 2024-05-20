import { forwardRef } from "react";
import { Group, Text, Avatar, Stack, Spoiler, Badge, Box } from '@mantine/core';
import { PostButtons, PostMenu } from "./PostWidgets";
import { Link } from "react-router-dom";
import ImagesDisplay from "./ImagesDisplay";
import FilesDisplay from "./FilesDisplay";

import moment from "moment";
import "moment/dist/locale/sk";
import { IconLock, IconWorld } from "@tabler/icons-react";
moment.locale("sk");

const Post = forwardRef(({ post, owner, group }, ref) => {
    const groupUrl = `/skupiny/${post.group._id}`;
    const authorUrl = `/${post.author.username}`;
    const postUrl = `${authorUrl}/prispevok/${post._id}`;

    const postContent = (
        <Link to={postUrl} key={post._id}>
            <Group px="md" py="sm" gap="xs" align="flex-start" pos="relative" wrap="nowrap" className="border-bottom">
                <PostMenu type="post" post={post} />

                {group ? (
                    <>
                        <Link to={authorUrl}>
                            <Avatar className="no-image" src={post.author.profilePicture?.thumbnail} />
                        </Link>

                        <Stack gap={0} pos="relative" style={{ flex: 1 }}>
                            <Group mb={4} pr={32} gap={4}>
                                <Link to={authorUrl}>
                                    <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                        {post.author.displayName}
                                    </Text>
                                </Link>
                                {post.author._id === owner &&
                                    <Badge variant="light" size="xs">Admin</Badge>
                                }
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
                                <div style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                                    {post.content}
                                </div>
                            </Spoiler>

                            <ImagesDisplay mt={8} images={post.images} />

                            <FilesDisplay mt={8} files={post.files} />

                            <PostButtons mt={8} post={post} />
                        </Stack>
                    </>
                ) : (
                    <Box style={{ flex: 1 }}>
                        <Group mb={8} pr={32} gap="xs">
                            <Link to={groupUrl}>
                                <Avatar className="no-image" src={post.group.profilePicture?.thumbnail} />
                            </Link>

                            <Stack gap={4}>
                                <Group gap={4}>
                                    <Link to={groupUrl}>
                                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                            {post.group.name}
                                        </Text>
                                    </Link>
                                    {post.group.isPrivate ?
                                        <IconLock size={16} stroke={1.25} />
                                        : <IconWorld size={16} stroke={1.25} />
                                    }
                                </Group>
                                <Group gap={4}>
                                    <Link to={authorUrl}>
                                        <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                                            {post.author.displayName}
                                        </Text>
                                    </Link>
                                    {post.author._id === post.group.owner &&
                                        <Badge variant="light" size="xs">Admin</Badge>
                                    }
                                    <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                                        &middot;
                                    </Text>
                                    <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                                        {moment(post.createdAt).fromNow()}
                                    </Text>
                                </Group>
                            </Stack>
                        </Group>

                        <Spoiler
                            maxHeight={100}
                            hideLabel="Zobraziť menej"
                            showLabel="Zobraziť viac"
                            styles={{
                                control: { color: "var(--mantine-color-dimmed)" },
                            }}
                        >
                            <div style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                                {post.content}
                            </div>
                        </Spoiler>

                        <ImagesDisplay mt={8} images={post.images} />

                        <FilesDisplay mt={8} files={post.files} />

                        <PostButtons mt={8} post={post} />
                    </Box>
                )}
            </Group>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post