import { Link } from "react-router-dom";
import { Box, Card, AspectRatio, Image, Text, Group, Title, NumberFormatter, Button } from '@mantine/core';
import Profile from "../templates/profile";
import Tags from "../templates/tags";
import { posts, users } from "../datababase";

export default function Article() {
    const post = posts[1];
    const user = users[314];

    return (
        <Box maw={1100} p="md" m="auto">
            <Group align="flex-start">
                <Box style={{ flex: 1 }}>
                    <Card padding="xl" radius="md" mb="md" withBorder>
                        <Card.Section>
                            <Link to="username/articlename">
                                <AspectRatio ratio={8 / 3}>
                                    <Image src={post.image} />
                                </AspectRatio>
                            </Link>
                        </Card.Section>
                        
                        <Group mt="lg" mb="lg" gap="xs">
                            <Profile user={ user } />
                        </Group>

                        <Text c="gray" size="sm">
                            Created 1 month ago • Updated 5 days ago • 105 Comments
                        </Text>

                        <Title
                            fw={800}
                            fz={48}
                            mb="xs"
                            style={{ lineHeight: 1.2 }}
                        >
                            {post.title}
                        </Title>

                        <Box mb="lg">
                            <Tags tags={post.tags} />
                        </Box>

                        <Text mb="md">{post.description}</Text>

                    </Card>
                </Box>
                <Box w={340}>
                    <Card padding="md" radius="md" mb="md" withBorder>
                        <Profile user={user} size="lg" />

                        <Text mt="md">
                            {user.description}
                        </Text>

                        <Group mt="md" gap="xl">
                            <Text>
                                <b><NumberFormatter value={user.posts} thousandSeparator /></b> Posts
                            </Text>
                            <Text>
                                <b><NumberFormatter value={user.likes} thousandSeparator /></b> Likes
                            </Text>
                        </Group>

                        <Button mt="md">
                            Follow
                        </Button>
                    </Card>
                </Box>
            </Group>
        </Box>
    )
}