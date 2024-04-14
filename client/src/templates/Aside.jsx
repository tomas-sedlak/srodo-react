import { Text, Loader } from "@mantine/core";
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
    const visbleNews = 5;

    return (
        <div key={title} className="news-card">
            <Text fw={700} px="lg" py="md" size="lg" style={{ lineHeight: 1 }}>{title}</Text>

            {data.slice(0, visbleNews).map(article =>
                <Link key={article.title} to={article.url} target="_blank" className="news-card-item">
                    <Text lineClamp={2} mb={4} style={{ lineHeight: 1.4 }}>{article.title}</Text>
                    <Text c="dimmed" size="sm">{article.author}</Text>
                </Link>
            )}
        </div>
    )
}