import { Text, Stack, ScrollArea, Collapse, Loader, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Aside() {
    const fetchArticles = async () => {
        const science = await axios.get("/api/news?category=science")
        const technology = await axios.get("/api/news?category=technology")
        return { science: science.data, technology: technology.data }
    }

    const { data, status } = useQuery({
        queryFn: fetchArticles,
        queryKey: ["news-aside"],
        staleTime: Infinity,
    })

    return (
        <aside className="aside">
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
                    <NewsCard data={data.science} title="Novinky vo vede" />
                    <NewsCard data={data.technology} title="Novinky v technológiách" />
                </>
            )}
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
            <Text c="dimmed" size="sm">{article.author}</Text>
        </Link>
    )
}