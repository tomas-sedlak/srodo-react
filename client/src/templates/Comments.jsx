import { Loader, Text } from '@mantine/core';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "./CreatePost";
import Comment from "templates/Comment";
import axios from "axios";

export default function Comments({ postId }) {
    const userId = useSelector(state => state.user?._id);

    const fetchComments = async () => {
        const response = await axios.get(`/api/post/${postId}/comments`);
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["comments", postId],
        queryFn: fetchComments,
    });

    return (
        <>
            {userId &&
                <CreatePost postId={postId} opened={false} />
            }

            {status === "pending" ? (
                <div className="loader-center-x">
                    <Loader />
                </div>
            ) : status === "error" ? (
                <div className="loader-center-x">
                    <p>Nastala chyba!</p>
                </div>
            ) : (
                <div id="komentare">
                    {data.length === 0 && (
                        <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne komentáre</Text>
                    )}

                    {data.map(comment => <Comment key={comment._id} data={comment} />)}
                </div>
            )}
        </>
    )
}