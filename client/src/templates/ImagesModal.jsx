import { useState } from 'react';
import { Loader, Text, Image, TextInput, Modal, Box, rem, Button, Center, Group, Tabs } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { IconSearch, IconX, IconUpload, IconPhoto } from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { createClient } from 'pexels';
import { useInfiniteQuery } from "@tanstack/react-query";
import { FixedSizeGrid } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";

const methods = [
    {
        value: "pexels",
        label: "Pexels",
    },
    {
        value: "url",
        label: "URL",
    },
    {
        value: "device",
        label: "Zo zariadenia",
    },
]

export default function ImagesModal({ opened, close, setImage, columns, aspectRatio, qkey }) {
    const LIMIT = 10;
    const client = createClient("prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1");

    const [query, setQuery] = useState("");
    const [itemCount, setItemCount] = useState(0);
    const [url, setUrl] = useState("");
    const [isUrlValid, setIsUrlValid] = useState(false);
    const [tab, setTab] = useState("pexels");
    const isMobile = useMediaQuery("(max-width: 768px)");

    async function search({ pageParam }) {
        if (!query || query === "") return await emptySearch(pageParam)
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
        queryKey: ["imagesModal", qkey, query],
        queryFn: search,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = lastPage.length ? allPages.length + 1 : undefined
            return nextPage
        },
    })

    const handleAddImage = () => {
        // Trigger the file input
        document.getElementById('imageInput').click();
    }

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
                    <Tabs variant="unstyled" value={tab} onChange={setTab}>
                        <Tabs.List className="custom-tabs">
                            {methods.map(method =>
                                <Tabs.Tab value={method.value}>
                                    {method.label}
                                </Tabs.Tab>
                            )}
                        </Tabs.List>
                    </Tabs>

                    <Modal.CloseButton />
                </Modal.Header>

                <Modal.Body h="calc(100% - 72px)">
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
                                        <IconX
                                            className="pointer"
                                            onClick={() => setQuery("")}
                                            stroke={1.25}
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
                                <Text c="dimmed">Neboli nájdené žiadne obrázky. Skontroluj či vyhľadávaš po anglicky.</Text>
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
                                                        columnCount={columns}
                                                        columnWidth={width / columns}
                                                        rowCount={data.pages.length * LIMIT / columns}
                                                        rowHeight={width / columns / aspectRatio}
                                                        ref={ref}
                                                        style={{ overflowX: "hidden", overflowY: "auto" }}
                                                        onItemsRendered={gridProps => {
                                                            onItemsRendered({
                                                                overscanStartIndex: gridProps.overscanRowStartIndex * columns,
                                                                overscanStopIndex: gridProps.overscanRowStopIndex * columns,
                                                                visibleStartIndex: gridProps.visibleRowStartIndex * columns,
                                                                visibleStopIndex: gridProps.visibleRowStopIndex * columns
                                                            });
                                                        }}
                                                    >
                                                        {({ rowIndex, columnIndex, style }) => {
                                                            const index = rowIndex * columns + columnIndex;
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
                        <>
                            <TextInput
                                className="search images-modal-search"
                                placeholder="URL obrázka"
                                value={url}
                                onChange={event => {
                                    setUrl(event.currentTarget.value)
                                    setIsUrlValid(true)
                                }}
                                leftSection={<IconSearch stroke={1.25} />}
                                rightSection={
                                    url !== "" && (
                                        <IconX
                                            className="pointer"
                                            onClick={() => setUrl("")}
                                            stroke={1.25}
                                        />
                                    )
                                }
                                styles={{
                                    section: {
                                        margin: "8px"
                                    },
                                }}
                            />

                            {isUrlValid ? (
                                <Box h="calc(100% - 52px)" style={{ overflowY: "auto" }}>
                                    <Image
                                        src={url}
                                        radius="lg"
                                        style={{ aspectRatio }}
                                        onError={() => setIsUrlValid(false)}
                                    />
                                    <Group mt="sm" justify="flex-end">
                                        <Button
                                            onClick={() => {
                                                setImage(url)
                                                close()
                                            }}
                                        >
                                            Nastaviť obrázok
                                        </Button>
                                    </Group>
                                </Box>
                            ) : (
                                <Text c="dimmed">Nesprávne URL</Text>
                            )}
                        </>
                    ) : (
                        // Trying the dropzone
                        <>
                           
                            <Dropzone
                                mt="md"
                                onDrop={(files) => {setImage(files[0])}}
                                onReject={(files) => console.log('rejected files', files)}
                                maxSize={5 * 1024 ** 2}
                                accept={IMAGE_MIME_TYPE}
                            >
                                <Center>
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
                                            style={{ width: rem(104), height: rem(104), color: 'var(--mantine-color-dimmed)' }}
                                            stroke={1.5}
                                        />
                                    </Dropzone.Idle>
                                </Center>
                                <Center mt="md" >
                                    <Text size="xl" inline>
                                        Drag images here or click to select files
                                    </Text>
                                </Center>
                                <Center mt="md" >
                                    <Button onClick={handleAddImage}>Add Images</Button>
                                </Center>
                            </Dropzone>
                        </>
                    )}
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    )
}