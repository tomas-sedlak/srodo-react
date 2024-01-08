import { forwardRef } from "react";
import { useState, useEffect } from 'react';
import { AspectRatio, Card, Group, Image, Text, Box, Avatar, Divider } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

const Post = forwardRef(({ post }, ref) => {
    const [user, setUser] = useState([]);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const url = "/" + user.username + "/" + post._id;

    // useEffect(() => {
    //     fetch("http://localhost:3000/user?id=" + post.author)
    //         .then(result => result.json())
    //         .then(user => setUser(user))
    // }, [])

    const postContent = (
        <>
        <Link to={url}>
            <Card ref={ref} key={post._id} className="custom-card" radius={0} p="sm">
                <AspectRatio ratio={650 / 273}>
                    <Image radius="lg" src={post.image} />
                </AspectRatio>


                <Group align="flex-start" wrap="nowrap" mt="md" gap="sm">
                    <Avatar />

                    <Box w="100%">
                        <Group gap={4} align="flex-start">
                            <Link to="username">
                                <Text fw={600} c="gray" size="sm">
                                    Display name
                                </Text>
                            </Link>
                            <Text
                                c="gray"
                                size="sm"
                            >
                                &middot; Článok &middot; 20min ago
                            </Text>
                        </Group>

                        <Text
                            className="link"
                            fw={700}
                            fz={24}
                            underline="never"
                            style={{ lineHeight: 1.2 }}
                            lineClamp={2}
                        >
                            {post.title}
                        </Text>

                        <Group justify="space-between" mt={8}>
                            <Group gap={8}>
                                <div className="icon-wrapper" onClick={(event) => { event.preventDefault(); setLiked(!liked) }}>
                                    {liked ?
                                        <IconHeartFilled className="likes-icon" stroke={1.25} />
                                        :
                                        <IconHeart stroke={1.25} />
                                    }
                                    <span>{liked ? 500 + 1 : 500}</span>
                                </div>

                                <div className="icon-wrapper">
                                    <IconMessageCircle stroke={1.25} />
                                    <span>14</span>
                                </div>

                                <div className="icon-wrapper" onClick={(event) => { event.preventDefault(); setSaved(!saved) }}>
                                    {saved ?
                                        <IconBookmarkFilled stroke={1.25} />
                                        :
                                        <IconBookmark stroke={1.25} />
                                    }
                                    <span>Uložiť</span>
                                </div>

                                {/* <Tooltip label="Likes" position="bottom" openDelay={600}>
                                        <Group className={`likes-icon ${liked && 'likes-icon-selected'}`} onClick={(event) => {event.preventDefault(); setLiked(!liked)}} gap={0} ml={-8}>
                                            <ActionIcon variant="subtle" color="gray" size="lg" radius="50%">
                                                {liked ?
                                                    <IconHeartFilled stroke={1.75} />
                                                    :
                                                    <IconHeart stroke={1.75} />
                                                }
                                            </ActionIcon>
                                            <Text c="gray" size="sm">
                                                {liked ? 500 + 1 : 500}
                                            </Text>
                                        </Group>
                                    </Tooltip>

                                    <Tooltip label="Komentáre" position="bottom" openDelay={600}>
                                        <Group  gap={0}>
                                            <ActionIcon variant="transparent" color="gray" size="lg" radius="50%">
                                                <IconMessageCircle stroke={1.75} />
                                            </ActionIcon>
                                            <Text c="gray" size="sm">5</Text>
                                        </Group>
                                    </Tooltip> */}
                            </Group>

                            {/* <Tooltip label="Uložiť" position="bottom" onClick={() => setSaved(!saved)} openDelay={600}>
                                    <Group className={`bookmark-icon ${saved && 'bookmark-icon-selected'}`} gap={0}>
                                        <ActionIcon variant="subtle" color="gray" size="lg" radius="50%">
                                            {saved ?
                                                <IconBookmarkFilled stroke={1.75} />
                                                :
                                                <IconBookmark stroke={1.75} />
                                            }
                                        </ActionIcon>
                                    </Group>
                                </Tooltip> */}
                        </Group>
                    </Box>
                </Group>
            </Card>
            <Divider color="gray.2" />
        </Link>
        </>
    )

    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post