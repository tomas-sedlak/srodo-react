import { forwardRef } from "react";
import { useState } from 'react';
import { AspectRatio, Group, Image, Text, Avatar, Divider } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

const Post = forwardRef(({ post }, ref) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    // const url = "/" + user.username + "/" + post._id;
    const url = "/user/" + post._id;

    const postContent = (
        <Link to={url}>
            <div key={post._id} className="post-card">
                <AspectRatio ratio={650 / 273}>
                    <Image radius="lg" src={post.image} />
                </AspectRatio>

                {/* Post information */}
                <Group align="flex-start" wrap="nowrap" mt="sm" gap="sm">
                    <Avatar />

                    <div>
                        <Group gap={4} align="center">
                            <Link to="username">
                                <Text fw={600} c="gray" size="sm">
                                    Display name
                                </Text>
                            </Link>
                            <Text c="gray" size="sm">
                                &middot; Článok &middot; {moment(post.createdAt).fromNow()}
                            </Text>
                        </Group>

                        <Text
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
                                
                                {/* Likes button */}
                                <div
                                    className={`icon-wrapper ${liked ? "like-selected" : "like"}`}
                                    onClick={(event) => { event.preventDefault(); setLiked(!liked) }}>
                                        {liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                                        <span>{liked ? 500 + 1 : 500}</span>
                                </div>

                                {/* Comments button */}
                                <div className="icon-wrapper">
                                    <IconMessageCircle stroke={1.25} />
                                    <span>14</span>
                                </div>

                                {/* Save button */}
                                <div
                                    className={`icon-wrapper ${saved ? "save-selected" : "save"}`}
                                    onClick={(event) => { event.preventDefault(); setSaved(!saved) }}>
                                        {saved ? <IconBookmarkFilled stroke={1.25} /> : <IconBookmark stroke={1.25} />}
                                        <span>{saved ? "Uložené" : "Uložiť"}</span>
                                </div>

                            </Group>
                        </Group>
                    </div>
                </Group>
            </div>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last post is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{postContent}</div> : postContent
})

export default Post