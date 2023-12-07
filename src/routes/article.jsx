import { Link } from "react-router-dom";
import { Box, Card, AspectRatio, Image, Text, Group, Title, NumberFormatter, Button } from '@mantine/core';
import Profile from "../templates/profile";
import Tags from "../templates/tags";
import News from "../templates/news";
import { posts, users } from "../datababase";

export default function Article() {
    const post = posts[1];
    const user = users[314];

    return (
        <Box maw={1280} p="md" m="auto">
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
                        
                        <Group mt="lg" mb="sm" gap="xs">
                            <Profile user={ user } />
                        </Group>

                        <Title
                            fw={800}
                            fz={48}
                            mb="sm"
                            style={{ lineHeight: 1.2 }}
                        >
                            {post.title}
                        </Title>

                        {/* <Box mb="lg">
                            <Tags tags={post.tags} />
                        </Box> */}

                        <Text c="gray" size="sm" mb="lg">
                            Created 1 month ago &middot; Updated 5 days ago &middot; 13 min read &middot; Biology
                        </Text>

                        <Text mb="md" size="lg">{post.description}</Text>

                    </Card>
                </Box>
                <Box w={340}>
                    <Card padding="md" radius="md" mb="md" withBorder>
                        <Profile user={user} size="lg" />

                        <Text mt="md">
                            {user.description ? user.description : "No user description"}
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

                    <News />
                </Box>
            </Group>
        </Box>
    )
}