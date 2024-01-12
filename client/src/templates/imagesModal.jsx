import { useState, useEffect } from 'react';
import { Tabs, Text, Image, TextInput, Modal, Grid, ActionIcon, ScrollArea, LoadingOverlay, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from 'pexels';
import { IconSearch, IconInfoCircle } from '@tabler/icons-react';

export default function ImagesModal({ opened, close, setImage }) {
    const client = createClient(import.meta.env.VITE_PEXELS_KEY);

    const [visible, loadingHandlers] = useDisclosure(false);
    const [query, setQuery] = useState("");
    const [photos, setPhotos] = useState([]);

    async function search(event) {
        event.preventDefault();
        loadingHandlers.open()

        query == "" ? emptySearch() : querySearch()

        loadingHandlers.close()
    }

    async function emptySearch() {
        const response = await client.photos.curated({ per_page: 30 })
        setPhotos(response.photos)
    }

    async function querySearch() {
        const response = await client.photos.search({ query, per_page: 30 })
        setPhotos(response.photos)
    }

    useEffect(() => {
        emptySearch()
    }, [])

    return (
        <Modal
            opened={opened}
            onClose={close}
            size="lg"
            title="Pridať obrázok"
        // style={{overflowY: "hidden"}}
        >
            <Tabs defaultValue="pexels">
                <Tabs.List>
                    <Tabs.Tab value="pexels">Pexels</Tabs.Tab>
                    <Tabs.Tab value="url">URL</Tabs.Tab>
                    <Tabs.Tab value="device">Zo zariadenia</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="pexels">

                    {/* <Alert mt="sm" p="sm" color="yellow" variant="light" icon={<IconInfoCircle />}>
                        Obrázky musíš vyhľadávať po anglicky
                    </Alert> */}

                    <form onSubmit={search}>
                        <TextInput
                            mt="sm"
                            placeholder="Obrázky musíš vyhľadávať po anglicky!"
                            value={query}
                            onChange={event => setQuery(event.currentTarget.value)}
                            rightSection={
                                <ActionIcon type="submit" variant="subtle">
                                    <IconSearch />
                                </ActionIcon>
                            }
                        />
                    </form>

                    <ScrollArea scrollbars="y" h="60vh" mt="sm">
                        <LoadingOverlay visible={visible} zIndex={1000} />

                        {photos.length <= 0 ?
                            <Text>Neboli nájdené žiadne obrázky. Skontroluj či vyhľadávaš po anglicky 🤔</Text>
                            :
                            <Grid gutter={5}>
                                {photos.map(photo => {
                                    return (
                                        <Grid.Col span={6} key={photo.id}>
                                            <Image
                                                src={photo.src.landscape}
                                                onClick={event => {
                                                    setImage(photo.src.landscape)
                                                    close()
                                                }}
                                                style={{ cursor: "pointer" }}
                                                radius="md"
                                            />
                                        </Grid.Col>
                                    )
                                })}
                            </Grid>
                        }
                    </ScrollArea>
                </Tabs.Panel>

                <Tabs.Panel value="url">
                    <form onSubmit={search}>
                        <TextInput
                            mt="sm"
                            placeholder="URL obrázka"
                            value={query}
                            onChange={event => setQuery(event.currentTarget.value)}
                            rightSection={
                                <ActionIcon type="submit" variant="subtle">
                                    <IconSearch />
                                </ActionIcon>
                            }
                        />
                    </form>
                </Tabs.Panel>

                <Tabs.Panel value="device">Upload from device</Tabs.Panel>
            </Tabs>
        </Modal>
    )
}