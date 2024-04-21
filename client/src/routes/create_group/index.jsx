import { useState } from 'react';
import { Box, Group, Button, AspectRatio, TextInput, Switch, Text, Tabs, Textarea } from '@mantine/core';
import { IconCamera, IconLock, IconTrash, IconWorld } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImagesModal from "templates/ImagesModal";
import axios from 'axios';

const nameMaxLength = 64;
const descriptionMaxLength = 160;
const initialData = {
    coverImage: "",
    name: "",
    description: "",
    isPrivate: false,
};

export default function CreateGroup() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const [tab, setTab] = useState("settings");
    const [data, setData] = useState(initialData);
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const setCoverImage = image => {
        setData({
            ...data,
            coverImage: image
        })
    }

    const setName = event => {
        if (event.target.value.length > nameMaxLength) return
        setData({
            ...data,
            name: event.target.value
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
            isPrivate: event.target.checked
        })
    }

    const isValid = () => data.name.length !== 0

    const publish = async () => {
        setIsPublishing(true)

        await axios.post("/api/group/", data, { headers });

        navigate("/")
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
                            <Group gap={8} className="bottom-right">
                                {data.coverImage &&
                                    <Button
                                        variant="default"
                                        leftSection={<IconTrash stroke={1.25} />}
                                        styles={{ section: { marginRight: 4 } }}
                                        onClick={() => setCoverImage("")}
                                    >
                                        Zmazať
                                    </Button>
                                }

                                <Button
                                    variant="default"
                                    leftSection={<IconCamera stroke={1.25} />}
                                    styles={{ section: { marginRight: 4 } }}
                                    onClick={coverImageModalHandlers.open}
                                >
                                    Pridať
                                </Button>
                            </Group>

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
                                value={data.name}
                                onChange={setName}
                            />
                            <Text
                                size="xs"
                                c="dimmed"
                                className="input-counter"
                            >
                                {data.name.length}/{nameMaxLength}
                            </Text>
                        </Box>

                        <Box pos="relative">
                            <Textarea
                                mt="sm"
                                autosize
                                minRows={2}
                                styles={{ input: { paddingRight: 46 } }}
                                placeholder="Popis skupiny (nepovinné)"
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
                            <Button
                                ml="auto"
                                loading={isPublishing}
                                disabled={!isValid()}
                                onClick={publish}
                            >
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

                        <Text mt="sm" fw={700} size="xl" c={data.name ? "var(--mantine-color-text)" : "dimmed"}>{data.name ? data.name : "Názov skupiny"}</Text>

                        <Text style={{ lineHeight: 1.4 }}>{data.description}</Text>

                        <Group gap={4}>
                            {data.isPrivate ?
                                <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                                : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                            }
                            <Text c="dimmed">{data.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                        </Group>
                    </>
                }
            </Box>
        </>
    );
}