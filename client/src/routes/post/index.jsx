import { useParams, Link } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@mantine/core';
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import PostTemplate from "templates/Post";
import Comments from "templates/Comments";
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
import SmallHeader from "templates/SmallHeader";
moment.locale("sk");

export default function Post() {
    const { postId } = useParams();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`, userId && { headers })
        return post.data
    }

    const { data, status } = useQuery({
        queryFn: fetchPost,
        queryKey: ["post", postId, userId],
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
            <Helmet>
                <title>{`${data.author.displayName}: "${data.content}"`}</title>
                <meta name="description" content={`${data.likes.length} ľuďom sa páči, ${data.comments} komentárov - ${data.author.displayName} na Šrodo: "${data.content}"`} />
            </Helmet>

            <SmallHeader withArrow title="Príspevok" />

            <PostTemplate post={data} withoutLink />

            <Comments postId={postId} owner={data.group.owner} />
        </>
    )
}