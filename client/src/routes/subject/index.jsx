import { Loader, Text } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Post from "templates/Post";
import axios from "axios";
import Message from "templates/Message";
import SmallHeader from "templates/SmallHeader";

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
            <Text>Nastala chyba!</Text>
        </div>
    ) : (
        <>
            <SmallHeader title={`Predmet - ${data.label} ${data.emoji}`} />

            {data.posts.length === 0 && <Message
                title="Zatiaľ žiadne príspevky"
                content="Buď prvý kto tu pridá príspevok."
            />}

            {data.posts.map(post => <Post post={post} />)}
        </>
    )
}