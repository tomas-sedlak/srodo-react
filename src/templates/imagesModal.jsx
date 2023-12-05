import { useState } from 'react';
import { Button, Tabs, Text, Image, TextInput, Modal, Grid, ActionIcon, ScrollArea, LoadingOverlay, Alert } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createClient } from 'pexels';
import { IconSearch, IconInfoCircle } from '@tabler/icons-react';

export default function ImagesModal() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');

    const [opened, { close, open }] = useDisclosure(false);
    const [visible, loadingHandlers] = useDisclosure(false);
    const [query, setQuery] = useState("");
    const [photos, setPhotos] = useState([]);

    async function search(event) {
        event.preventDefault();
        loadingHandlers.open()
        const response = await client.photos.search({ query, per_page: 30 })
        setPhotos(response.photos)
        loadingHandlers.close()
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                size="lg"
                title="Upload cover image"
                centered
                style={{overflowY: "hidden"}}
            >
                <Tabs defaultValue="pexels">
                    <Tabs.List>
                        <Tabs.Tab value="pexels">From Pexels</Tabs.Tab>
                        <Tabs.Tab value="device">From device</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="pexels">

                        <Alert mt="sm" p="sm" color="yellow" variant="light" icon={<IconInfoCircle />}>
                            Obrázky musíš vyhľadávať po anglicky
                        </Alert>

                        <form onSubmit={search}>
                            <TextInput
                                mt="sm"
                                placeholder="Search photos"
                                value={query}
                                onChange={event => setQuery(event.currentTarget.value)}
                                rightSection={
                                    <ActionIcon type="submit" variant="subtle">
                                        <IconSearch />
                                    </ActionIcon>
                                }
                            />
                        </form>

                        <ScrollArea h="50vh" mt="sm">
                            <LoadingOverlay visible={visible} zIndex={1000} />

                            <Grid gutter={5}>
                                {photos.map(photo => {
                                    return (
                                        <Grid.Col span={6} key={photo.id}>
                                            <Image
                                                src={photo.src.landscape}
                                                onClick={event => console.log(photo.id)}
                                                style={{ cursor: "pointer" }}
                                            />
                                        </Grid.Col>
                                    )
                                })}
                            </Grid>
                        </ScrollArea>
                    </Tabs.Panel>
                    <Tabs.Panel value="device">Second panel</Tabs.Panel>
                </Tabs>
            </Modal>

            <Button onClick={open}>
                Upload image
            </Button>
        </>
    )
}