import { useState } from 'react';
import { Loader, Text, Image, TextInput, Modal, CloseButton, Box } from '@mantine/core';
import { IconSearch,IconX, IconUpload, IconPhoto } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { createClient } from 'pexels';
import { useInfiniteQuery } from "@tanstack/react-query";
import { FixedSizeGrid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

export default function ImagesModal({ opened, close, setImage }) {
    const client = createClient("prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1");

    const COLUMNS = 2;
    const LIMIT = 10;

    const [query, setQuery] = useState("");
    const [itemCount, setItemCount] = useState(0);
    const [tab, setTab] = useState("pexels");
    const isMobile = useMediaQuery("(max-width: 768px)");

    async function search({ pageParam }) {
        if (query === "") return await emptySearch(pageParam)
        else return await querySearch(pageParam)
    }

    async function emptySearch(pageParam) {
        const response = await client.photos.curated({ per_page: LIMIT, page: pageParam })
        setItemCount(response.total_results)
        return response.photos
    }

    async function querySearch(pageParam) {
        const response = await client.photos.search({ query, per_page: LIMIT, page: pageParam })
        setItemCount(response.total_results)
        return response.photos
    }

    const {
        data,
        fetchNextPage,
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

    return (
        <Modal.Root
            opened={opened}
            onClose={close}
            size="lg"
            padding="sm"
            fullScreen={isMobile}
        >
            <Modal.Overlay />

            <Modal.Content radius={isMobile ? 0 : "lg"} h="100%">
                <Modal.Header>
                    <Text ml="sm" onClick={() => setTab("pexels")}>Pexels</Text>
                    <Text ml="sm" onClick={() => setTab("url")}>URL</Text>
                    <Text ml="sm" onClick={() => setTab("device")}>Zo zariadenia</Text>

                    <Modal.CloseButton />
                </Modal.Header>

                <Modal.Body h="calc(100% - 52px)">
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
                            ) : itemCount == 0 ? (
                                <div className="loader-center">
                                    <Text>Neboli nájdené žiadne obrázky. Skontroluj či vyhľadávaš po anglicky.</Text>
                                </div>
                            ) : (
                                <Box h="calc(100% - 52px)">
                                    <AutoSizer>
                                        {({ width, height }) => (
                                            <InfiniteLoader
                                                isItemLoaded={index => index < data.pages.length * LIMIT}
                                                itemCount={itemCount}
                                                loadMoreItems={fetchNextPage}
                                            >
                                                {({ onItemsRendered, ref }) => (
                                                    <FixedSizeGrid
                                                        height={height}
                                                        width={width}
                                                        columnCount={COLUMNS}
                                                        columnWidth={width / COLUMNS}
                                                        rowCount={data.pages.length * LIMIT / COLUMNS}
                                                        rowHeight={width / COLUMNS * (1 / 2)} // ASPECT RATIO
                                                        ref={ref}
                                                        style={{ overflowX: "hidden", overflowY: "auto" }}
                                                        onItemsRendered={gridProps => {
                                                            onItemsRendered({
                                                                overscanStartIndex: gridProps.overscanRowStartIndex * COLUMNS,
                                                                overscanStopIndex: gridProps.overscanRowStopIndex * COLUMNS,
                                                                visibleStartIndex: gridProps.visibleRowStartIndex * COLUMNS,
                                                                visibleStopIndex: gridProps.visibleRowStopIndex * COLUMNS
                                                            });
                                                        }}
                                                    >
                                                        {({ rowIndex, columnIndex, style }) => {
                                                            const index = rowIndex * COLUMNS + columnIndex;
                                                            let image;
                                                            try {
                                                                image = data.pages[Math.floor(index / LIMIT)][index % LIMIT].src.landscape;
                                                            } catch {
                                                                return (<></>)
                                                            }

                                                            return (
                                                                <Image
                                                                    src={image}
                                                                    radius="lg"
                                                                    p={2}
                                                                    onClick={() => {
                                                                        setImage(image)
                                                                        close()
                                                                    }}
                                                                    style={{ ...style, cursor: "pointer" }}
                                                                />
                                                            )
                                                        }}
                                                    </FixedSizeGrid>
                                                )}
                                            </InfiniteLoader>
                                        )}
                                    </AutoSizer>
                                </Box>
                            )}
                        </>
                    ) : tab === "url" ? (
                        <Text>Nahraj z URL</Text>
                    ) : (
                        // Trying the dropzone

                        <Dropzone
                            onDrop={(files) => console.log('accepted files', files)}
                            onReject={(files) => console.log('rejected files', files)}
                            maxSize={5 * 1024 ** 2}
                            accept={IMAGE_MIME_TYPE}
                        >
                            <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                                <Dropzone.Accept>
                                    <IconUpload
                                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Accept>
                                <Dropzone.Reject>
                                    <IconX
                                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Reject>
                                <Dropzone.Idle>
                                    <IconPhoto
                                        style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                                        stroke={1.5}
                                    />
                                </Dropzone.Idle>

                                <div>
                                    <Text size="xl" inline>
                                        Drag images here or click to select files
                                    </Text>
                                    <Text size="sm" c="dimmed" inline mt={7}>
                                        Attach as many files as you like, each file should not exceed 5mb
                                    </Text>
                                </div>
                            </Group>
                        </Dropzone>
                    )}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}