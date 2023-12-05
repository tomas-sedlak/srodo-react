import { Link } from "react-router-dom";
import { Box, Card, AspectRatio, Image, Text, Group, Button, Badge, Affix } from '@mantine/core';
import ImagesModal from "../templates/imagesModal";
import { ProfileHover } from "../templates/profile";
import Tags from "../templates/tags";
import News from "../templates/news"
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
        label: "News",
        link: "/tags",
        leftSection: "📰"
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
                <Box maw={240} style={{ flex: 1 }} className="sticky-navbar">
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
                </Box>
                <Box style={{ flex: 1 }}>
                    {posts.map((post) => {
                        return <ArticleCard post={post} /> 
                    })}
                    <Text ta="center" p="lg">Dostal si sa az na koniec stranky 🥳</Text>
                </Box>
                <Box maw={320} style={{ flex: 1 }}>
                    <Card padding="md" radius="md" mb="md" withBorder>
                        <ImagesModal />
                    </Card>

                    <News />
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
                    <AspectRatio ratio={10 / 3}>
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
                    lineClamp={2}
                >
                    {post.title}
                </Text>
            </Link>

            <Text mb="sm" c="dark" style={{ lineHeight: 1.4 }} lineClamp={2}>{post.description}</Text>

            <Group>
                <Text size="sm" c="grey">
                    1 week ago &middot; 13 min read &middot; Biology
                </Text>
            </Group>
        </Card>
    )
}