import { useState, useEffect } from 'react';
import { Loader, Text, Image, TextInput, Modal, Grid, AspectRatio, CloseButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { createClient } from 'pexels';
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { IconSearch } from '@tabler/icons-react';

export default function ImagesModal({ opened, close, setImage }) {
    const client = createClient(import.meta.env.VITE_PEXELS_KEY);
    const { ref, inView } = useInView();

    const [query, setQuery] = useState("");
    const [tab, setTab] = useState("pexels");
    const isMobile = useMediaQuery("(max-width: 768px)");

    async function search({ pageParam }) {
        if (query === "") return emptySearch(pageParam)
        else return querySearch(pageParam)
    }

    async function emptySearch(pageParam) {
        const response = await client.photos.curated({ per_page: 10, page: pageParam })
        return response.photos
    }

    async function querySearch(pageParam) {
        const response = await client.photos.search({ query, per_page: 10, page: pageParam })
        return response.photos
    }

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ["images", "modal", query],
        queryFn: search,
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

    return (
        <Modal.Root
            opened={opened}
            onClose={close}
            size="lg"
            padding="sm"
            fullScreen={isMobile}
        >
            <Modal.Overlay />

            <Modal.Content radius={isMobile ? 0 : "lg"}>
                <Modal.Header>
                    <Text ml="sm" onClick={() => setTab("pexels")}>Pexels</Text>
                    <Text ml="sm" onClick={() => setTab("url")}>URL</Text>
                    <Text ml="sm" onClick={() => setTab("device")}>Zo zariadenia</Text>

                    <Modal.CloseButton />
                </Modal.Header>

                <Modal.Body>
                    {tab === "pexels" ? (
                        <>
                            <TextInput
                                className="search images-modal-search"
                                placeholder="Obrázky musíš vyhľadávať po anglicky!"
                                value={query}
                                onChange={event => setQuery(event.currentTarget.value)}
                                leftSection={<IconSearch stroke={1.25} />}
                                rightSection={
                                    query !== "" && (
                                        <CloseButton
                                            variant="subtle"
                                            radius="lg"
                                            c="gray"
                                            onMouseDown={(event) => event.preventDefault()}
                                            onClick={() => setQuery("")}
                                            aria-label="Clear value"
                                        />
                                    )
                                }
                                styles={{
                                    section: {
                                        margin: "8px"
                                    },
                                }}
                            />

                            {status === "pending" ? (
                                <div className="loader-center">
                                    <Loader />
                                </div>
                            ) : status === "error" ? (
                                <div className="loader-center">
                                    <Text>Nastala chyba</Text>
                                </div>
                            ) : (
                                <>
                                    {data.pages[0].length <= 0 ?
                                        <div className="loader-center">
                                            <Text>Neboli nájdené žiadne obrázky. Skontroluj či vyhľadávaš po anglicky 🤔</Text>
                                        </div>
                                        :
                                        <Grid gutter={4}>
                                            {data.pages.map(page => (
                                                page.map((photo, i) => (
                                                    <Grid.Col ref={page.length === i + 1 ? ref : undefined} span={6} key={photo.id}>
                                                        <AspectRatio ratio={2 / 1}>
                                                            <Image
                                                                src={photo.src.landscape}
                                                                onClick={event => {
                                                                    setImage(photo.src.landscape)
                                                                    close()
                                                                }}
                                                                style={{ cursor: "pointer" }}
                                                                radius="lg"
                                                            />
                                                        </AspectRatio>
                                                    </Grid.Col>
                                                ))
                                            ))}
                                        </Grid>}

                                    {hasNextPage && <div className="loader-center-x"><Loader /></div>}
                                </>
                            )}
                        </>
                    ) : tab === "url" ? (
                        <Text>Nahraj z URL</Text>
                    ) : (
                        <Text>Zo zariadenia</Text>
                    )}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}