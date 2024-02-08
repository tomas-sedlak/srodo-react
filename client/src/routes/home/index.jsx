import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Loader } from "@mantine/core";
import Post from "templates/post";

export default function Home() {
    const { ref, inView } = useInView();
    const userId = "65b1848bfbb5fbbc9cda4acd"

    const fetchPosts = async ({ pageParam }) => {
        const response = await fetch(`/api/post/?page=${pageParam}&userId=${userId}`);
        return response.json();
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["posts"],
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
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            {/* TODO: make custom error messages ;) */}
            <p>Nastala chyba!</p>
            {/* TODO: make custom error messages ;) */}
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