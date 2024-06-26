import { forwardRef } from "react";
import { Group, Text, Avatar, Stack, Spoiler, Badge } from '@mantine/core';
import { PostButtons, PostMenu } from "./PostWidgets";
import { Link } from "react-router-dom";
import ImagesDisplay from "./ImagesDisplay";
import FilesDisplay from "./FilesDisplay";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

const Post = forwardRef(({ post, owner }, ref) => {
    const authorUrl = `/${post.author.username}`;
    const postUrl = `${authorUrl}/prispevok/${post._id}`;

    const postContent = (
        <Link to={postUrl} key={post._id}>
            <Group px="md" py="sm" gap="xs" align="flex-start" pos="relative" wrap="nowrap" className="border-bottom">
                <Link to={authorUrl}>
                    <Avatar className="no-image" src={post.author.profilePicture?.thumbnail} />
                </Link>

                <PostMenu type="post" post={post} />

                <Stack gap={0} pos="relative" style={{ flex: 1 }}>
                    <Group mb={2} pr={32} gap={4}>
                        <Link to={"/" + post.author.username}>
                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                {post.author.displayName}
                            </Text>
                        </Link>
                        {post.author._id === owner &&
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
                        <div style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                            {post.content}
                        </div>
                    </Spoiler>

                    <ImagesDisplay mt={8} images={post.images} />

                    <FilesDisplay mt={8} files={post.files} />

                    <PostButtons mt={8} post={post} />
                </Stack>
            </Group>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post