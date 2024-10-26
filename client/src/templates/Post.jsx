import { forwardRef } from "react";
import { Group, Text, Avatar, Stack, Spoiler, Badge, Tooltip } from '@mantine/core';
import { IconLock, IconWorld } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { PostButtons, PostMenu } from "./PostWidgets";
import ImagesDisplay from "./ImagesDisplay";
import FilesDisplay from "./FilesDisplay";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk", {
    relativeTime: {
        s: "%ds",
        m: "%dmin",
        mm: "%dmin",
        h: "%dh",
        hh: "%dh",
        d: "%dd",
        dd: "%dd",
    }
});

const Linkify = ({ children }) => {
    const isUrl = word => {
        const urlPattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm;
        return word.match(urlPattern)
    }

    const addMarkup = word => {
        return isUrl(word) ?
            `<a href="${word}" target="_blank" style="text-decoration: underline; color: var(--mantine-color-blue-4);">${word}</a>` :
            word
    }

    const words = children.split(' ')
    const formatedWords = words.map((w, i) => addMarkup(w))
    const html = formatedWords.join(' ')
    return (<span style={{ whiteSpace: "pre-line", wordBreak: "break-word" }} dangerouslySetInnerHTML={{ __html: html }} />)
}

const Post = forwardRef(({ post, owner, group, withoutLink }, ref) => {
    const groupUrl = `/skupiny/${post.group._id}`;
    const authorUrl = `/${post.author.username}`;
    const postUrl = `${authorUrl}/prispevok/${post._id}`;

    const showLongTime = Date.now() - new Date(post.createdAt) > 1000 * 60 * 60 * 24 * 30; // less then a month

    let postContent = (
        <Group key={post._id} px="md" py="sm" gap="xs" align="flex-start" pos="relative" wrap="nowrap" className="border-bottom">
            <PostMenu type="post" post={post} />

            {group ? (
                <>
                    <Link to={authorUrl}>
                        <Avatar className="no-image" src={post.author.profilePicture?.thumbnail} />
                    </Link>

                    <Stack gap={8} pos="relative" style={{ flex: 1 }}>
                        <Group pr={32} gap={4} wrap="nowrap" miw={0} style={{ flex: 1 }}>
                            <Link to={authorUrl} style={{ lineHeight: 1, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                <Text span fw={700} size="sm" style={{ lineHeight: 1 }}>
                                    {post.author.displayName}
                                </Text>
                            </Link>
                            {post.author._id === owner &&
                                <Badge variant="light" size="xs" style={{ flexShrink: 0 }}>Admin</Badge>
                            }
                            <Text c="dimmed" size="sm" style={{ lineHeight: 1, flexShrink: 0 }}>
                                &middot;
                            </Text>
                            <Tooltip disabled={showLongTime} label={moment(post.createdAt).format("D. MMM yyyy")} openDelay={500} withArrow>
                                <Text c="dimmed" size="sm" style={{ lineHeight: 1, flexShrink: 0 }}>
                                    {showLongTime ?
                                        moment(post.createdAt).year() == moment().year() ?
                                            moment(post.createdAt).format("D. MMM")
                                            : moment(post.createdAt).format("D. MMM yyyy")
                                        : moment(post.createdAt).fromNow(true)
                                    }
                                </Text>
                            </Tooltip>
                        </Group>

                        <Spoiler
                            maxHeight={90}
                            hideLabel="Zobraziť menej"
                            showLabel="Zobraziť viac"
                            styles={{
                                content: { lineHeight: 1.4 },
                                control: { color: "var(--mantine-color-dimmed)" },
                            }}
                        >
                            <Linkify>{post.content}</Linkify>
                        </Spoiler>

                        <ImagesDisplay images={post.images} />

                        <FilesDisplay files={post.files} />

                        <PostButtons post={post} />
                    </Stack>
                </>
            ) : (
                <Stack gap={8} style={{ flex: 1 }}>
                    <Group pr={32} gap="xs">
                        <Link to={groupUrl}>
                            <Avatar className="no-image" src={post.group.profilePicture?.thumbnail} />
                        </Link>

                        <Stack gap={4} miw={0} style={{ flex: 1 }}>
                            <Group gap={4} wrap="nowrap">
                                <Link to={groupUrl} style={{ lineHeight: 1, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                    <Text span fw={700} size="sm" style={{ lineHeight: 1 }}>
                                        {post.group.name}
                                    </Text>
                                </Link>
                                {post.group.isPrivate ?
                                    <IconLock size={16} stroke={1.25} style={{ flexShrink: 0 }} />
                                    : <IconWorld size={16} stroke={1.25} style={{ flexShrink: 0 }} />
                                }
                            </Group>
                            <Group gap={4} wrap="nowrap">
                                <Link to={authorUrl} style={{ lineHeight: 1, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                                    <Text span c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                                        {post.author.displayName}
                                    </Text>
                                </Link>
                                {post.author._id === post.group.owner &&
                                    <Badge variant="light" size="xs" style={{ flexShrink: 0 }}>Admin</Badge>
                                }
                                <Text c="dimmed" size="sm" style={{ lineHeight: 1, flexShrink: 0 }}>
                                    &middot;
                                </Text>
                                <Tooltip disabled={showLongTime} label={moment(post.createdAt).format("D. MMM yyyy")} openDelay={500} withArrow>
                                    <Text c="dimmed" size="sm" style={{ lineHeight: 1, flexShrink: 0 }}>
                                        {showLongTime ?
                                            moment(post.createdAt).year() == moment().year() ?
                                                moment(post.createdAt).format("D. MMM")
                                                : moment(post.createdAt).format("D. MMM yyyy")
                                            : moment(post.createdAt).fromNow(true)
                                        }
                                    </Text>
                                </Tooltip>
                            </Group>
                        </Stack>
                    </Group>

                    <Spoiler
                        maxHeight={90}
                        hideLabel="Zobraziť menej"
                        showLabel="Zobraziť viac"
                        styles={{
                            content: { lineHeight: 1.4 },
                            control: { color: "var(--mantine-color-dimmed)" },
                        }}
                    >
                        <div style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}>
                            <Linkify>{post.content}</Linkify>
                        </div>
                    </Spoiler>

                    <ImagesDisplay images={post.images} />

                    <FilesDisplay files={post.files} />

                    <PostButtons post={post} />
                </Stack>
            )}
        </Group>
    )

    if (!withoutLink) {
        postContent = (
            <Link to={postUrl} key={post._id}>{postContent}</Link>
        )
    }

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post