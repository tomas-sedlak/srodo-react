import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Loader, Text } from "@mantine/core";
import { useSelector } from "react-redux";
import Post from "templates/Post";
import axios from "axios";

export default function Home() {
    const { ref, inView } = useInView();
    const userId = useSelector(state => state.user?._id)

    const fetchPosts = async ({ pageParam }) => {
        if (!userId) return []
        const response = await axios.get(`/api/post/?page=${pageParam}&userId=${userId}`);
        return response.data;
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["posts", userId],
        queryFn: fetchPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = lastPage.length ? allPages.length + 1 : undefined
            return nextPage
        },
    })

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage])

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
            <Text>Už to bude 😉</Text>
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            {data.pages.map((page) => (
                page.map((post, i) => {
                    return <Post ref={page.length === i + 1 ? ref : undefined} post={post} />
                })
            ))}

            {hasNextPage && <div className="loader-center-x"><Loader /></div>}
        </>
    )
}