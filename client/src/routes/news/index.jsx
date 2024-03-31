import { Box, Loader, Tabs } from "@mantine/core";
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const categories = [
    {
        label: "Technológia",
        category: "technology",
    },
    {
        label: "Veda",
        category: "science",
    },
]

export default function News() {
    const [searchParams, setSearchParams] = useSearchParams();
    const active = searchParams.get("c") ? searchParams.get("c") : categories[0].category;

    const fetchNews = async () => {
        const response = await axios.get(`/api/news?category=${active}`);
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["news-page", active],
        queryFn: fetchNews,
    })

    return (
        <>
            <Tabs variant="unstyled" value={active} onChange={category => setSearchParams({ c: category })} p="sm" className="border-bottom">
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
                        <Box className="border-bottom light-hover" p="sm">
                            <Link to={article.url} target="_blank">{article.title}</Link>
                        </Box>
                    ))}
                </>
            )}
        </>
    )
}