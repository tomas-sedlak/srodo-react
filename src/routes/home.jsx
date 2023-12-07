import { AspectRatio, Badge, Box, Button, Card, Group, Image, Text } from '@mantine/core';
import { Link } from "react-router-dom";
import { posts, users } from "../datababase";
import News from "../templates/news";
import { ProfileHover } from "../templates/profile";

const menu = [
    {
        label: "Domov",
        link: "/",
        leftSection: "🏠"
    },
    {
        label: "Šrodo AI",
        link: "/ai",
        leftSection: "🧠",
        badge: "Nové!"
    },
    {
        label: "Novinky",
        link: "/tags",
        leftSection: "📰"
    },
]

const categories = [
    {
        label: "Matematika",
        link: "/",
        leftSection: "📈"
    },
    {
        label: "Informatika",
        link: "/",
        leftSection: "💻"
    },
    {
        label: "Jazyky",
        link: "/",
        leftSection: "💬"
    },
    {
        label: "Biológia",
        link: "/",
        leftSection: "🧬"
    },
    {
        label: "Chémia",
        link: "/",
        leftSection: "🧪"
    },
    {
        label: "Fyzika",
        link: "/",
        leftSection: "⚡"
    },
    {
        label: "Geografia",
        link: "/",
        leftSection: "🌍"
    },
    {
        label: "Umenie",
        link: "/",
        leftSection: "🎨"
    },
    {
        label: "Šport",
        link: "/",
        leftSection: "💪"
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
                    <Text fw={700} mt="md" mb="sm" ml="sm">Predmety</Text>
                    {categories.map((value) => {
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
                <Box maw={340} style={{ flex: 1 }}>
                    <News />
                </Box>
            </Group>
        </Box>
    )
}

function ArticleCard({ post }) {
    const user = users[post.author]

    return (
        <Card padding="lg" radius="md" mb="sm" withBorder>
            <Card.Section>
                <Link to="/article">
                    <AspectRatio ratio={10 / 4}>
                        <Image src={post.image} />
                    </AspectRatio>
                </Link>
            </Card.Section>
            
            <Group mt="md" mb="sm" gap="sm">
                <ProfileHover user={user} />
            </Group>

            <Link to="/article">
                <Text
                    c="black"
                    fw={700}
                    fz={24}
                    underline="never"
                    mb="sm"
                    style={{ lineHeight: 1.2 }}
                    lineClamp={2}
                >
                    {post.title}
                </Text>
            </Link>

            <Group>
                <Text size="sm" c="grey">
                    1 week ago &middot; 13 min read &middot; Biology
                </Text>
            </Group>
        </Card>
    )
}