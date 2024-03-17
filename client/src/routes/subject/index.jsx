import { Box, Loader, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "templates/Post";
import axios from "axios";

export default function Subject() {
    const { subject } = useParams()

    const fetchSubject = async () => {
        const response = await axios.get(`/api/subjects/${subject}`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["subject", subject],
        queryFn: fetchSubject,
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <Box p="sm" className="border-bottom">
                <Text fw={600}>Predmet - {data.label} {data.emoji}</Text>
            </Box>

            {data.posts.length === 0 && (
                <Box  mx="auto" p="xl" maw={420}>
                    <Text ta="center" fw={800} fz={24} style={{ lineHeight: 1.2 }}>Zatiaľ žiadne príspevky</Text>
                    <Text ta="center" c="gray" mt={8}>Buď prvý kto tu pridá príspevok.</Text>
                </Box>
            )}

            {data.posts.map(post => <Post post={post} />)}
        </>
    )
}