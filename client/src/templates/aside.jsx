import { Link } from "react-router-dom";
import { Card, Box, Text, Divider, Autocomplete, ActionIcon, Group, NumberFormatter, Button, Avatar, AspectRatio, Image } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconSearch } from '@tabler/icons-react';
import Profile from "../templates/profile";

export default function Aside() {
    const apiUrlScience = "https://newsapi.org/v2/top-headlines?category=science&country=sk&apiKey=d9426e5878fa4d919bae81d659bd7b06"
    const apiUrlTechnology = "https://newsapi.org/v2/top-headlines?category=technology&country=us&apiKey=d9426e5878fa4d919bae81d659bd7b06"

    const [scienceArticles, setScienceArticles] = useState([])
    const [technologyArticles, setTechnologyArticles] = useState([])

    const user = {
        displayName: "Display name",
        username: "username"
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    function fetchArticles() {
        fetch(apiUrlScience)
            .then(response => response.json())
            .then(json => { setScienceArticles(json.articles); console.log(json) })

        fetch(apiUrlTechnology)
            .then(response => response.json())
            .then(json => { setTechnologyArticles(json.articles) })
    }

    return (
        <aside className="aside">
            <Autocomplete
                className="search"
                size="md"
                placeholder="Hľadať"
                rightSection={
                    <ActionIcon color="dark" variant="transparent">
                        <IconSearch />
                    </ActionIcon>
                }
            />

            <Card className="custom-card" mb="md">
                <Profile user={user} size="lg" />
                
                {user.description &&
                    <Text mt="md">
                        {user.description}
                    </Text>
                }

                <Group mt="md" gap="lg">
                    <Text>
                        <b>1K</b> Príspevkov
                    </Text>
                    <Text>
                        <b>1,2M</b> Sledovateľov
                    </Text>
                </Group>

                <Button mt="md" size="md">
                    Sledovať
                </Button>
            </Card>

            <Card className="custom-card" mb="md" p={0}>
                <Text fw={700} size="lg" p="md" style={{ lineHeight: 1 }}>Novinky vo vede</Text>
                <Divider color="#f2f2f2" />
                {scienceArticles.slice(0, 5).map((article, index) => {
                    return (
                        <>
                            <Box p="md">
                                <Link to={article.url} target="_blank">
                                    <Text className="link" mb="xs" style={{ lineHeight: 1.2 }}>{article.title}</Text>
                                    <Text c="gray" size="sm">{article.source.name} &middot; {article.author}</Text>
                                </Link>
                            </Box>
                            {index < 4 && <Divider color="#f2f2f2" />}
                        </>
                    )
                })}
            </Card>

            <Card className="custom-card" mb="md" p={0}>
                <Text fw={700} size="lg" p="md" style={{ lineHeight: 1 }}>Novinky v technologiach</Text>
                <Divider color="#f2f2f2" />
                {technologyArticles.slice(0, 5).map((article, index) => {
                    return (
                        <>
                            <Box p="md">
                                <Link to={article.url} target="_blank">
                                    <Text mb="xs" c="dark" style={{ lineHeight: 1.2 }}>{article.title}</Text>
                                    <Text c="gray" size="sm">{article.source.name} &middot; {article.author}</Text>
                                </Link>
                            </Box>
                            {index < 4 && <Divider color="#f2f2f2" />}
                        </>
                    )
                })}
            </Card>
        </aside>
    )
}