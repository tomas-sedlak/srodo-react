import { AspectRatio, Box, Image, Loader, Text } from "@mantine/core";
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
        queryKey: ["subject"],
        queryFn: fetchSubject,
    })

    return status === "pending" ? (
        <div className="loader-center-x">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <AspectRatio ratio={6 / 2}>
                <Image src={data.image} />
            </AspectRatio >

            <Box px="sm" pb="sm" className="border-bottom">
                <Text>{data.label}</Text>
                <Text style={{ lineHeight: 1.4 }}>{data.text}</Text>
            </Box>

            {data.posts.map(post => <Post post={post} />)}
        </>
    )
}