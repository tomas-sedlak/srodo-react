import { useState } from 'react';
import { Box, Loader, Tabs } from "@mantine/core";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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

    const fetchNews = async () => {
        const response = await axios.get(`/api/news?category=${activeTab}`);
        console.log(response.data);
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["news-page", activeTab],
        queryFn: fetchNews,
    })

    return (
        <>
            <Tabs variant="unstyled" value={activeTab} onChange={setActiveTab} p="sm" className="border-bottom">
                <Tabs.List className="custom-tabs">
                    {categories.map(subject =>
                        <Tabs.Tab value={subject.category}>
                            {subject.label}
                        </Tabs.Tab>
                    )}
                </Tabs.List>
            </Tabs>

            {status === "pending" ? (
                <div className="loader-center">
                    <Loader />
                </div>
            ) : status === "error" ? (
                <div className="loader-center">
                    <p>Nastala chyba!</p>
                </div>
            ) : (
                <>
                    {data.map((article) => (
                        <Box className="border-bottom" p="sm">
                            <Link to={article.url} target="_blank">{article.title}</Link>
                        </Box>
                    ))}
                </>
            )}
        </>
    )
}