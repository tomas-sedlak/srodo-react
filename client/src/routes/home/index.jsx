import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Badge, Box, Button, Group, Loader, Text, useMantineColorScheme } from "@mantine/core";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Post from "templates/Post";
import SmallHeader from "templates/SmallHeader";
import Message from "templates/Message";
import GroupList from "templates/GroupList";
import AdSenseAd from "templates/AdSenseAd";
import axios from "axios";

export default function Home() {
    const { ref, inView } = useInView();
    const userId = useSelector(state => state.user?._id)
    const { colorScheme } = useMantineColorScheme()
    const isMobile = useMediaQuery("(max-width: 768px)")

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
            <Helmet>
                <title>Šrodo - Od študentov študentom</title>
                <meta name="description" content="Šrodo je sociálna sieť pre študentov, kde môžu zdieľať svoje vedomosti a zapájať sa do diskusií. Taktiež aj generovať interaktívne kvízy s pomocou AI." />
            </Helmet>

            {isMobile &&
                <SmallHeader
                    title={
                        <Link to="/">
                            <Group gap={0}>
                                {colorScheme === "light" ? <img width={36} height={36} src="/images/logo_light.png" /> : <img width={36} height={36} src="/images/logo_dark.png" />}
                                <Text ml={8} fw={700} fz={24}>Šrodo</Text>
                                <Badge ml={4} mb={8} variant="light" size="xs">BETA</Badge>
                            </Group>
                        </Link>
                    }
                />
            }

            <GroupList />

            {data.pages[0].length === 0 &&
                <div className="loader-center">
                    <Message
                        title="Zatiaľ celkom nuda, čo 🥱? "
                        content="Pripoj sa do skupiny a tu sa ti zobrazia jej najnovšie príspevky."
                        cta={
                            <Link to="/preskumat">
                                <Button>Nájdi skupinu</Button>
                            </Link>
                        }
                    />
                </div>
            }

            {data.pages.map((page) => (
                page.map((post, i) => {
                    if (i == 1 || i + 1 % 10 == 0) {
                        return (
                            <>
                                <Box px="md" py="sm" className="border-bottom">
                                    <AdSenseAd
                                        adClient="ca-pub-4886377834765269"
                                        adSlot="6924990323"
                                    />
                                </Box>
                                <Post ref={page.length === i + 1 ? ref : undefined} post={post} />
                            </>
                        )
                    } else {
                        return <Post ref={page.length === i + 1 ? ref : undefined} post={post} />
                    }
                })
            ))}

            {hasNextPage && <div className="loader-center-x"><Loader /></div>}
        </>
    )
}