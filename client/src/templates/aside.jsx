import { Link } from "react-router-dom";
import { Card, Box, Text, Divider, Autocomplete, Stack, ScrollArea, Group, NumberFormatter, Button, Avatar, AspectRatio, Image } from '@mantine/core';
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
            {/* <Autocomplete
                className="search"
                size="md"
                placeholder="Hľadať"
                rightSection={
                    <ActionIcon color="dark" variant="transparent">
                        <IconSearch />
                    </ActionIcon>
                }
            /> */}

            {/* <Card className="custom-card" mb="md">
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
            </Card> */}

            <ScrollArea p="sm" scrollbarSize={8} scrollHideDelay={0} h="100%">
                <Stack>
                <Card padding="lg" bg="gray.1" radius="lg">
                    <Text fw={700} mb="md" size="lg" style={{ lineHeight: 1 }}>Novinky vo vede</Text>
                    
                    <Stack>
                    {scienceArticles.slice(0, 5).map((article) => {
                        return (
                            <Link to={article.url} target="_blank">
                                <Text className="link" lineClamp={2} mb={4} style={{ lineHeight: 1.4 }}>{article.title}</Text>
                                <Text c="gray" size="sm">{article.author}</Text>
                            </Link>
                        )
                    })}
                    </Stack>
                </Card>

                <Card padding="lg" bg="gray.1" radius="lg">
                    <Text fw={700} mb="md" size="lg" style={{ lineHeight: 1 }}>Novinky v technologiach</Text>
                    
                    <Stack>
                    {technologyArticles.slice(0, 5).map((article) => {
                        return (
                            <Link to={article.url} target="_blank">
                                <Text className="link" lineClamp={2} mb={4} style={{ lineHeight: 1.4 }}>{article.title}</Text>
                                <Text c="gray" size="sm">{article.author}</Text>
                            </Link>
                        )
                    })}
                    </Stack>
                </Card>
                </Stack>
            </ScrollArea>
        </aside>
    )
}