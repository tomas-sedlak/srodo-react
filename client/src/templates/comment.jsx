import { useState } from 'react';
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, TextInput, ActionIcon, Flex, Paper, UnstyledButton, Collapse, Textarea, Card, Button } from '@mantine/core';
import { IconSend, IconHeart, IconHeartFilled, IconMessageCircle } from '@tabler/icons-react';
import { Link } from "react-router-dom";

export default function Comment({ depth }) {
    const [liked, setLiked] = useState(false);

    return (
        <Group gap={8} align="flex-start" mt="sm" ml={depth * 46}>
            <Avatar />

            <Box py={8} style={{ flex: 1 }}>
                <Group gap={4}>
                    <Link to="username">
                        <Text fw={600} c="gray" size="sm">
                            Display name
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; pred 13 min
                    </Text>
                </Group>

                <Text my={8}>Awesome comment</Text>

                <Group gap={8}>
                    <div
                        className={`icon-wrapper ${liked ? "like-selected" : "like"}`}
                        onClick={(event) => { event.preventDefault(); setLiked(!liked) }}
                    >
                        {liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                        <span>{liked ? 5 + 1 : 5}</span>
                    </div>

                    <div className={`icon-wrapper`}>
                        <IconMessageCircle stroke={1.25} />
                        <span>Odpovedať</span>
                    </div>
                </Group>
            </Box>
        </Group>
    )
}