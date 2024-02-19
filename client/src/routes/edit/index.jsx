import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { Loader } from "@mantine/core";
import axios from "axios"

export default function Edit() {
    const { postId } = useParams();

    const fetchPost = async () => {
        const result = await axios.get(`/api/post/${postId}`)
        return result.data
    }

    const { data, status } = useQuery({
        queryKey: ["editPost"],
        queryFn: fetchPost
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
        <></>
    )
}