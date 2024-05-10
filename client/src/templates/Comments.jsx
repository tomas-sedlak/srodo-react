import { Loader, Text } from '@mantine/core';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import CreatePost from ".S/CreatePost";
import Comment from "templates/Comment";
import axios from "axios";

export default function Comments({ postId }) {
    const userId = useSelector(state => state.user?._id);

    const fetchComments = async () => {
        const response = await axios.get(`/api/post/${postId}/comments`);
        return response.data;
    }

    const { status, data, refetch } = useQuery({
        queryKey: ["comments", postId],
        queryFn: fetchComments,
    });

    return status === "pending" ? (
        <div className="loader-center-x">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <div id="komentare">
            {userId &&
                <CreatePost postId={postId} opened={false} />
            }

            {data.length === 0 && (
                <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne komentáre</Text>
            )}

            {data.map(comment => <Comment data={comment} />)}
        </div>
    )
}