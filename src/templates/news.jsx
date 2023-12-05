import { Link } from "react-router-dom";
import { Alert, Card, Box, Text, Divider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconInfoCircle } from '@tabler/icons-react';

export default function News() {
    const apiUrlScience = "https://newsapi.org/v2/top-headlines?category=science&country=us&apiKey=d9426e5878fa4d919bae81d659bd7b06"
    const apiUrlTechnology = "https://newsapi.org/v2/top-headlines?category=technology&country=us&apiKey=d9426e5878fa4d919bae81d659bd7b06"

    const [scienceArticles, setScienceArticles] = useState([])
    const [technologyArticles, setTechnologyArticles] = useState([])

    useEffect(() => {
        fetchArticles()
    }, [])

    function fetchArticles() {
        fetch(apiUrlScience)
            .then(response => response.json())
            .then(json => {setScienceArticles(json.articles)})
        
        fetch(apiUrlTechnology)
            .then(response => response.json())
            .then(json => {setTechnologyArticles(json.articles)})
    }

    return (
        <>
        <Alert mb="md" radius="md" color="yellow" variant="light" icon={<IconInfoCircle />}>
            Novinky su <b>oneskorene o 24 hodin</b>. Ak nam pomozete vyzbierat $449 mesacne, spravy budu aktualne.
        </Alert>
        <Card radius="md" mb="md" p={0} withBorder>
            <Text fw={700} p="sm">Novinky vo vede</Text>
            <Divider />
            {scienceArticles.slice(0, 5).map((article, index) => {
                return (
                    <>
                        <Box p="md">
                            <Link to={article.url} target="_blank">
                                <Text mb="xs" c="dark" style={{ lineHeight: 1.2 }}>{article.title}</Text>
                                <Text c="gray" size="sm">{article.source.name} &middot; {article.author}</Text>
                            </Link>
                        </Box>
                        {index < 4 && <Divider />}
                    </>
                )
            })}
        </Card>
        <Card radius="md" mb="md" p={0} withBorder>
            <Text fw={700} p="sm">Novinky v technologiach</Text>
            <Divider />
            {technologyArticles.slice(0, 5).map((article, index) => {
                return (
                    <>
                        <Box p="md">
                            <Link to={article.url} target="_blank">
                                <Text mb="xs" c="dark" style={{ lineHeight: 1.2 }}>{article.title}</Text>
                                <Text c="gray" size="sm">{article.source.name} &middot; {article.author}</Text>
                            </Link>
                        </Box>
                        {index < 4 && <Divider />}
                    </>
                )
            })}
        </Card>
        </>
    )
}