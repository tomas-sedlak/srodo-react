import { Link } from "react-router-dom";
import { Box, Card, AspectRatio, Image, Text, Group, Button, Badge } from '@mantine/core';
import { ProfileHover } from "../templates/profile";
import Tags from "../templates/tags";
import { posts, users } from "../datababase";

const menu = [
    {
        label: "Home",
        link: "/",
        leftSection: "🏠"
    },
    {
        label: "Srodo AI",
        link: "/ai",
        leftSection: "🤖",
        badge: "new!"
    },
    {
        label: "Tags",
        link: "/tags",
        leftSection: "🏷️"
    },
    {
        label: "Math",
        link: "/",
        leftSection: "📈"
    },
    {
        label: "Informatic",
        link: "/",
        leftSection: "💻"
    },
    {
        label: "Biology",
        link: "/",
        leftSection: "🧬"
    },
    {
        label: "Geography",
        link: "/",
        leftSection: "🌍"
    },
    {
        label: "Chemistry",
        link: "/",
        leftSection: "🧪"
    }
]

const tags = [
    {
        label: "#python",
        link: "/",
    },
    {
        label: "#math",
        link: "/",
    },
    {
        label: "#javascript",
        link: "/",
    },
    {
        label: "#react",
        link: "/",
    },
    {
        label: "#biology",
        link: "/",
    },
    {
        label: "#spisi",
        link: "/",
    },
    {
        label: "#joko",
        link: "/",
    },
    {
        label: "#jano",
        link: "/",
    },
    {
        label: "#ilovemath",
        link: "/",
    },
    {
        label: "#coro",
        link: "/",
    },
]

export default function Home() {
    return (
        <Box maw={1280} p="md" m="auto">
            <Group align="flex-start">
                <Box w={240}>
                    {menu.map((value) => {
                        return (
                            <Link to={value.link}>
                                <Button
                                    px="sm"
                                    leftSection={value.leftSection}
                                    rightSection={value.badge && <Badge variant="light" color="green">{value.badge}</Badge>}
                                    variant="subtle"
                                    color="dark"
                                    size="md"
                                    fw={400}
                                    justify="flex-start"
                                    fullWidth
                                >
                                    {value.label}
                                </Button>
                            </Link>
                        )
                    })}

                    <Text
                        mt="lg"
                        mb="sm"
                        fw={700}
                    >
                        Popular tags
                    </Text>

                    {tags.map((value) => {
                        return (
                            <Link to={value.link}>
                                <Button
                                    px="sm"
                                    variant="subtle"
                                    color="dark"
                                    size="md"
                                    fw={400}
                                    justify="flex-start"
                                    fullWidth
                                >
                                    {value.label}
                                </Button>
                            </Link>
                        )
                    })}
                </Box>
                <Box style={{ flex: 1 }}>
                    {posts.map((post) => {
                        return <ArticleCard post={post} /> 
                    })}
                </Box>
                <Box w={320}>
                    <Card padding="md" radius="md" mb="md" withBorder>
                        <Text>
                            Some interesting news...
                        </Text>
                    </Card>
                </Box>
            </Group>
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

            <Text mb="sm" lineClamp={3}>{post.description}</Text>

            <Tags tags={post.tags} />
        </Card>
    )
}