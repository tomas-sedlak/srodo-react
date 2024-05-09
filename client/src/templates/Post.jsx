import { forwardRef } from "react";
import { Group, Text, Avatar, Stack, Spoiler, Image, Badge } from '@mantine/core';
import { Link } from "react-router-dom";
import { DownloadFile, PostButtons, PostMenu } from "./PostWidgets";
import moment from "moment";

const Post = forwardRef(({ post, owner }, ref) => {
    const authorUrl = `/${post.author.username}`;
    const postUrl = `${authorUrl}/prispevok/${post._id}`;

    const postContent = (
        <Link to={postUrl}>
            <Group px="md" py="sm" gap="xs" align="flex-start" pos="relative" className="border-bottom">
                <Link to={authorUrl}>
                    <Avatar className="no-image" src={post.author.profilePicture} />
                </Link>

                <PostMenu post={post} />

                <Stack gap={0} pos="relative" style={{ flex: 1 }}>
                    <Group mb={2} gap={4}>
                        <Link to={"/" + post.author.username}>
                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                {post.author.displayName}
                            </Text>
                        </Link>
                        {owner && post.author._id === owner._id &&
                            <Badge variant="light" size="xs">Admin</Badge>
                        }
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

                    {post.images.length > 0 &&
                        post.images.map(image =>
                            <Image mt={8} radius="lg" src={image.thumbnail} />
                        )}

                    {post.files.length > 0 &&
                        <Group mt={8} gap={8}>
                            {post.files.map(file =>
                                <DownloadFile file={file} />
                            )}
                        </Group>
                    }

                    <PostButtons mt={8} post={post} />
                </Stack>
            </Group>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post