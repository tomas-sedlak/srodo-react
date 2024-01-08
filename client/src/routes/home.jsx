import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { LoadingOverlay, Text } from "@mantine/core";
import Post from "../templates/post";

export default function Home() {
    const { ref, inView } = useInView();

    const fetchPosts = async ({ pageParam }) => {
        console.log(pageParam)
        const response = await fetch("http://localhost:3000/?page=" + pageParam);
        return response.json();
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["posts", "homepage"],
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
    }, [inView, fetchNextPage, hasNextPage]);

    return status === "pending" ? (
        <div className="content">
            <LoadingOverlay visible={true} />
        </div>
    ) : status === "error" ? (
        <p>Nastala chyba!</p>
    ) : (
        <div className="content">
            {data.pages.map((page) => (
                page.map((post, i) => {
                    if (page.length === i + 1) {
                        return <Post ref={ref} post={post} />
                    }
                    return <Post post={post} />
                })
            ))}
            {isFetchingNextPage && <Text py="lg" bg="red">Loading...</Text>}
        </div>
    )
}