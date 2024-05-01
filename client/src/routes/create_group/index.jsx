import { useState } from 'react';
import { Box, Group, Button, AspectRatio, TextInput, Switch, Text, Tabs, Textarea, Avatar, Image } from '@mantine/core';
import { IconCamera, IconLock, IconTrash, IconWorld } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ImagesModal from "templates/ImagesModal";
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const nameMaxLength = 64;
const descriptionMaxLength = 160;
const initialData = {
    coverImage: "",
    profilePicture: "",
    name: "",
    description: "",
    isPrivate: false,
};

export default function CreateGroup() {
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const profilePictureSize = isMobile ? 96 : 128;
    const navigate = useNavigate();
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const [tab, setTab] = useState("settings");
    const [data, setData] = useState(initialData);
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [profilePictureModalOpened, profilePictureModalHandlers] = useDisclosure(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const setCoverImage = image => {
        setData({
            ...data,
            coverImage: image
        })
    }

    const setProfilePicture = image => {
        setData({
            ...data,
            profilePicture: image
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

        try {
            const response = await axios.post("/api/group/", data, { headers });
            queryClient.invalidateQueries("groups");
            navigate(`/skupiny/${response.data.id}`)
        } catch (err) {
            console.log(err)
        }

        setIsPublishing(false)
    }

    return (
        <>
            <ImagesModal
                opened={coverImageModalOpened}
                close={coverImageModalHandlers.close}
                setImage={setCoverImage}
                columns={isMobile ? 1 : 2}
                aspectRatio={6 / 2}
            />

            <ImagesModal
                opened={profilePictureModalOpened}
                close={profilePictureModalHandlers.close}
                setImage={setProfilePicture}
                columns={isMobile ? 2 : 3}
                aspectRatio={1 / 1}
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
                                    c="red"
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

                        <AspectRatio ratio={6 / 2}>
                            {data.coverImage ?
                                <Image src={data.coverImage} />
                                : <Box className="no-image"></Box>
                            }
                        </AspectRatio>
                    </Box>

                    <Box px="md" py="sm">
                        <Group align="center" gap="xs">
                            <Avatar
                                size="xl"
                                className="no-image"
                                src={data.profilePicture}
                            />

                            <Button
                                variant="default"
                                leftSection={<IconCamera stroke={1.25} />}
                                styles={{ section: { marginRight: 4 } }}
                                onClick={profilePictureModalHandlers.open}
                            >
                                Zmeniť
                            </Button>

                            {data.profilePicture &&
                                <Button
                                    variant="default"
                                    leftSection={<IconTrash stroke={1.25} />}
                                    styles={{ section: { marginRight: 4 } }}
                                    onClick={() => setProfilePicture("")}
                                    c="red"
                                >
                                    Zmazať
                                </Button>
                            }
                        </Group>

                        <Box pos="relative">
                            <TextInput
                                mt="sm"
                                styles={{ input: { paddingRight: 46 } }}
                                label="Názov skupiny"
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
                                label="Popis skupiny (nepovinné)"
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
                    </Box>
                </>
            }

            {tab === "preview" &&
                <>
                    <AspectRatio ratio={6 / 2}>
                        {data.coverImage ?
                            <Image src={data.coverImage} />
                            : <Box className="no-image"></Box>
                        }
                    </AspectRatio>

                    <div style={{ position: "relative" }}>
                        <Avatar
                            className="profile-picture"
                            size={profilePictureSize}
                            src={data.profilePicture}
                        />
                    </div>

                    <Group px="md" h={profilePictureSize / 2} justify="flex-end">
                        <Button disabled>
                            Pripojiť sa
                        </Button>
                    </Group>

                    <Box px="md" py="sm">
                        <Text
                            fw={700}
                            size="xl"
                            style={{ lineHeight: 1.2 }}
                            c={data.name ? "var(--mantine-color-text)" : "dimmed"}
                        >
                            {data.name ? data.name : "Názov skupiny"}
                        </Text>

                        <Text mt="sm">
                            {data.description}
                        </Text>

                        <Group gap={4}>
                            {data.isPrivate ?
                                <IconLock color="var(--mantine-color-dimmed)" stroke={1.25} />
                                : <IconWorld color="var(--mantine-color-dimmed)" stroke={1.25} />
                            }
                            <Text c="dimmed">{data.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                        </Group>
                    </Box>

                    <Tabs
                        px="md"
                        className="border-bottom"
                        variant="unstyled"
                        value="prispevky"
                    >
                        <Tabs.List className="custom-tabs">
                            <Tabs.Tab disabled value="prispevky">
                                Príspevky
                            </Tabs.Tab>
                            <Tabs.Tab disabled value="clenovia">
                                Členovia
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>
                </>
            }
        </>
    );
}