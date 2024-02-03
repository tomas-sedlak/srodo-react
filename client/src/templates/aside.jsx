import { Link } from "react-router-dom";
import { Text, Stack, ScrollArea, Collapse } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

export default function Aside() {
    const [scienceArticles, setScienceArticles] = useState([])
    const [technologyArticles, setTechnologyArticles] = useState([])

    function fetchArticles() {
        fetch(import.meta.env.VITE_API_URL + "/news?category=science")
            .then(response => response.json())
            .then(json => setScienceArticles(json))

        fetch(import.meta.env.VITE_API_URL + "/news?category=technology")
            .then(response => response.json())
            .then(json => setTechnologyArticles(json))
    }

    // TODO: replace useEffect with TanstackQuery
    useEffect(fetchArticles, [])
    // TODO: replace useEffect with TanstackQuery

    return (
        <aside className="aside">
            <ScrollArea scrollbarSize={8} scrollHideDelay={0} h="100%">
                <Stack>
                    <NewsCard data={scienceArticles} title="Novinky vo vede" />
                    <NewsCard data={technologyArticles} title="Novinky v technológiách" />
                </Stack>
            </ScrollArea>
        </aside>
    )
}

function NewsCard({ data, title }) {
    const [opened, { toggle }] = useDisclosure(false);
    const visbleNews = 4;
    const maxNews = 10;

    return (
        <div className="news-card">
            <Text fw={700} mb="md" size="lg" style={{ lineHeight: 1 }}>{title}</Text>

            <Stack>
                {data.slice(0, visbleNews).map((article) => <NewsContent article={article} />)}
            </Stack>

            {data.length > visbleNews &&
                <>
                    <Collapse in={opened} mt="sm">
                        <Stack>
                            {data.slice(visbleNews, maxNews).map((article) => <NewsContent article={article} />)}
                        </Stack>
                    </Collapse>
                    
                    <Text
                        mt="sm"
                        className="pointer"
                        size="sm"
                        fw={600}
                        onClick={toggle}
                    >
                        {opened ? "Zobraziť menej" : "Zobraziť viac"}
                    </Text>
                </>
            }
        </div>
    )
}

function NewsContent({ article }) {
    return (
        <Link to={article.url} target="_blank">
            <Text className="link" lineClamp={2} mb={4} style={{ lineHeight: 1.4 }}>{article.title}</Text>
            <Text c="gray" size="sm">{article.author}</Text>
        </Link>
    )
}