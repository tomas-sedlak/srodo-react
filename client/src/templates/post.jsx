import { useState, useEffect } from 'react';
import { AspectRatio, Card, Group, Image, Text, Box, ActionIcon, Tooltip, Badge, Avatar } from '@mantine/core';
import { IconHeart, IconHeartFilled, IconMessageCircle, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Post({ post }) {
    const [user, setUser] = useState([]);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const url = "/" + user.username + "/" + post._id;

    useEffect(() => {
        fetch("http://localhost:3000/user?id=" + post.author)
            .then(result => result.json())
            .then(user => setUser(user))
    }, [])

    return (
        <Card key={post._id} className="custom-card" padding="md" mt={8}>
            <Card.Section>
                <Link to={url}>
                    <div className="image-item-left">
                        <Badge color="black" c="white" variant="light">Článok</Badge>
                    </div>
                    <AspectRatio ratio={650 / 273}>
                        <Image src={post.image} />
                    </AspectRatio>
                </Link>
            </Card.Section>

            <Group align="flex-start" wrap="nowrap" mt="md" gap="sm">
                <Avatar />

                <Box w="100%">
                    <Group gap={4} align="flex-start">
                        <Link to="username">
                            <Text fw={700} size="sm">
                                Display name
                            </Text>
                        </Link>
                        <Text
                            c="gray"
                            size="sm"
                        >
                            &middot;
                        </Text>
                        <Text
                            c="gray"
                            size="sm"
                        >
                            Biologia
                        </Text>
                        <Text
                            c="gray"
                            size="sm"
                        >
                            &middot;
                        </Text>
                        <Tooltip label="12:20 18. Decembra 2023" openDelay={600}>
                            <Text
                                c="gray"
                                size="sm"
                            >
                                20m
                            </Text>
                        </Tooltip>
                    </Group>

                    <Link to={url}>
                        <Text
                            mt={4}
                            className="link"
                            fw={700}
                            fz={24}
                            underline="never"
                            style={{ lineHeight: 1.2 }}
                            lineClamp={2}
                        >
                            {post.title}
                        </Text>
                    </Link>

                    <Group justify="space-between">
                        <Group gap="md">
                            <Tooltip label="Likes" position="bottom" openDelay={600}>
                                <Group className={`likes-icon ${liked && 'likes-icon-selected'}`} onClick={() => setLiked(!liked)} gap={0} ml={-8}>
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
                            </Tooltip>
                        </Group>

                        <Tooltip label="Uložiť" position="bottom" onClick={() => setSaved(!saved)} openDelay={600}>
                            <Group className={`bookmark-icon ${saved && 'bookmark-icon-selected'}`} gap={0}>
                                <ActionIcon variant="subtle" color="gray" size="lg" radius="50%">
                                    {saved ?
                                        <IconBookmarkFilled stroke={1.75} />
                                        :
                                        <IconBookmark stroke={1.75} />
                                    }
                                </ActionIcon>
                            </Group>
                        </Tooltip>
                    </Group>
                </Box>
            </Group>
        </Card>
    )
}