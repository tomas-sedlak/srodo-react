import { useState, useEffect } from 'react';
import { Box, Group, Button, AspectRatio, TextInput, Switch, Text, Tabs, Textarea, Avatar } from '@mantine/core';
import { IconLock, IconPencil, IconWorld } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { createClient } from 'pexels';

const titleMaxLength = 64;
const descriptionMaxLength = 160;
const initialData = {
    coverImage: "",
    title: "",
    description: "",
    private: false,
};

export default function CreateGroup() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');
    const user = useSelector(state => state.user);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const [tab, setTab] = useState("settings");
    const [data, setData] = useState(initialData);
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    }, []);

    const setCoverImage = image => {
        setData({
            ...data,
            coverImage: image
        })
    }

    const setTitle = event => {
        if (event.target.value.length > titleMaxLength) return
        setData({
            ...data,
            title: event.target.value
        })
    }

    const setDescription = event => {
        if (event.target.value.length > descriptionMaxLength) return
        setData({
            ...data,
            description: event.target.value
        })
    }

    const setPrivate = event => {
        setData({
            ...data,
            private: event.target.checked
        })
    }

    return (
        <>
            <ImagesModal
                opened={coverImageModalOpened}
                close={coverImageModalHandlers.close}
                setImage={setCoverImage}
                columns={isMobile ? 1 : 2}
                aspectRatio={2 / 1}
            />

            <Tabs
                px="md"
                variant="unstyled"
                value={tab}
                onChange={setTab}
            >
                <Tabs.List className="custom-tabs">
                    <Tabs.Tab value="settings">
                        Nastavenia
                    </Tabs.Tab>
                    <Tabs.Tab value="preview">
                        Ukážka
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            <Box px="md" py="sm">
                {tab === "settings" &&
                    <>
                        <Box pos="relative">
                            <Button
                                className="bottom-right"
                                variant="default"
                                leftSection={<IconPencil stroke={1.25} />}
                                styles={{ section: { marginRight: 4 } }}
                                onClick={coverImageModalHandlers.open}
                            >
                                Upraviť
                            </Button>

                            <AspectRatio ratio={2 / 1}>
                                <Box
                                    className="lazy-image pointer"
                                    style={{ backgroundImage: `url(${data.coverImage})` }}
                                    onClick={coverImageModalHandlers.open}
                                ></Box>
                            </AspectRatio>
                        </Box>

                        <Box pos="relative">
                            <TextInput
                                mt="md"
                                styles={{ input: { paddingRight: 46 } }}
                                placeholder="Názov skupiny"
                                value={data.title}
                                onChange={setTitle}
                            />
                            <Text
                                size="xs"
                                c="dimmed"
                                className="input-counter"
                            >
                                {data.title.length}/{titleMaxLength}
                            </Text>
                        </Box>

                        <Box pos="relative">
                            <Textarea
                                mt="sm"
                                autosize
                                minRows={2}
                                styles={{ input: { paddingRight: 46 } }}
                                placeholder="Popis skupiny"
                                value={data.description}
                                onChange={setDescription}
                            />
                            <Text
                                size="xs"
                                c="dimmed"
                                className="input-counter"
                            >
                                {data.description.length}/{descriptionMaxLength}
                            </Text>
                        </Box>

                        <Group mt="sm">
                            <Switch
                                checked={data.private}
                                onChange={setPrivate}
                            />
                            <Text>Súkromná skupina</Text>
                        </Group>
                        <Text mt={4} size="xs" c="dimmed">Ak je skupina súkromna, príspevky budú vidieť iba pozvaný používatelia</Text>

                        <Group mt="md">
                            <Button ml="auto" loading={isPublishing}>
                                Vytvoriť skupinu
                            </Button>
                        </Group>
                    </>
                }

                {tab === "preview" &&
                    <>
                        <AspectRatio ratio={2 / 1}>
                            <Box
                                className="lazy-image pointer"
                                style={{ backgroundImage: `url(${data.coverImage})` }}
                            ></Box>
                        </AspectRatio>

                        <Text mt="sm" fw={700} size="xl" c={!data.title ? "dimmed" : "text"}>{data.title ? data.title : "Názov skupiny"}</Text>

                        <Text style={{ lineHeight: 1.4 }}>{data.description}</Text>

                        <Group gap={4}>
                            {data.private ?
                                <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                                : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                            }
                            <Text c="dimmed">{data.private ? "Súkromná" : "Verejná"} skupina</Text>
                        </Group>
                    </>
                }
            </Box>
        </>
    );
}