import { Link } from "react-router-dom";
import { Box, Card, AspectRatio, Image, Text, Group } from '@mantine/core';
import { ProfileHover } from "../templates/profile";
import Tags from "../templates/tags";
import { posts, users } from "../datababase";

export default function Home() {
    return (
        <Box maw={650} p="md" m="auto">
            {posts.map((post) => {
                return <ArticleCard post={post} /> 
            })}
        </Box>
    )
}

function ArticleCard({ post }) {
    const user = users[post.author]

    return (
        <Card padding="lg" radius="md" mb="xs" withBorder>
            <Card.Section>
                <Link to="/article">
                    <AspectRatio ratio={8 / 3}>
                        <Image src={post.image} />
                    </AspectRatio>
                </Link>
            </Card.Section>
            
            <Group mt="md" mb="sm" gap="xs">
                <ProfileHover user={user} />
            </Group>

            <Link to="/article">
                <Text
                    c="black"
                    fw={700}
                    fz={24}
                    underline="never"
                    mb="xs"
                    style={{ lineHeight: 1.2 }}
                >
                    {post.title}
                </Text>
            </Link>

            <Text mb="md" lineClamp={3}>{post.description}</Text>

            <Tags tags={post.tags} />
        </Card>
    )
}