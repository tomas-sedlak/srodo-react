import { Link } from "react-router-dom";
import { Text, Stack, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function Aside() {
    const apiUrlScience = "https://newsapi.org/v2/top-headlines?category=science&country=sk&apiKey=d9426e5878fa4d919bae81d659bd7b06"
    const apiUrlTechnology = "https://newsapi.org/v2/top-headlines?category=technology&country=us&apiKey=d9426e5878fa4d919bae81d659bd7b06"

    const [scienceArticles, setScienceArticles] = useState([])
    const [technologyArticles, setTechnologyArticles] = useState([])

    function fetchArticles() {
        fetch(apiUrlScience)
            .then(response => response.json())
            .then(json => { setScienceArticles(json.articles); console.log(json) })

        fetch(apiUrlTechnology)
            .then(response => response.json())
            .then(json => { setTechnologyArticles(json.articles) })
    }

    // TODO: replace useEffect with TanstackQuery
    useEffect(fetchArticles, [])
    // TODO: replace useEffect with TanstackQuery

    return (
        <aside className="aside">
            <ScrollArea p="sm" scrollbarSize={8} scrollHideDelay={0} h="100%">
                <Stack>
                    <div className="news-card">
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
                    </div>

                    <div className="news-card">
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
                    </div>
                </Stack>
            </ScrollArea>
        </aside>
    )
}