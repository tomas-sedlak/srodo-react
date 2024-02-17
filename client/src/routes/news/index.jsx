import { useState, useEffect } from 'react';
import { Box, Tabs } from "@mantine/core";
import { Link } from 'react-router-dom';
import axios from 'axios';

const categories = [
    {
        label: "veda",
        category: "science",
    },
    {
        label: "technologie",
        category: "technology",
    }
]

export default function News() {
    const [activeTab, setActiveTab] = useState(categories[0].category);
    const [news, setNews] = useState([]);

    const fetchNews = async (category) => {
        const response = await axios.get(`/api/news?category=${category}`);
        setActiveTab(category)
        setNews(response.data);
    }

    useEffect(() => {
        fetchNews(categories[0].category);
    }, [])

    return (
        <>
            <Tabs variant="unstyled" value={activeTab} onChange={fetchNews} p="sm" className="border-bottom">
                <Tabs.List className="custom-tabs">
                    {categories.map(subject =>
                        <Tabs.Tab value={subject.category}>
                            {subject.label}
                        </Tabs.Tab>
                    )}
                </Tabs.List>
            </Tabs>

            {news.map((article) => (
                <Box className="border-bottom" p="sm">
                    <Link to={article.url} target="_blank">{article.title}</Link>
                </Box>
            ))}
        </>
    )
}