import { useState } from 'react';
import { Box, Group, Button, AspectRatio, TextInput, Switch, Text, Textarea, Avatar, Image, Stack } from '@mantine/core';
import { IconCamera, IconTrash } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { notifications } from '@mantine/notifications';
import { Helmet } from 'react-helmet';
import ImagesModal from "templates/ImagesModal";
import SmallHeader from 'templates/SmallHeader';
import axios from 'axios';

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
    const navigate = useNavigate();
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

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
            const formData = new FormData();
            formData.append("coverImage", data.coverImage);
            formData.append("profilePicture", data.profilePicture);
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("isPrivate", data.isPrivate);

            const response = await axios.post("/api/group/", formData, { headers });
            await queryClient.invalidateQueries("groups");
            navigate(`/skupiny/${response.data.id}`);

            notifications.show({
                title: "Skupina vytvorená",
            });
        } catch (err) {
            console.log(err)
        }

        setIsPublishing(false)
    }

    return (
        <>
            <Helmet>
                <title>Vytvoriť skupinu / Šrodo</title>
                <meta name="description" content="Vytvor skupinu na Šrodo a zdieľaj vedomosti." />
            </Helmet>

            <ImagesModal
                opened={coverImageModalOpened}
                close={coverImageModalHandlers.close}
                setImage={setCoverImage}
                columns={isMobile ? 1 : 2}
                aspectRatio={6 / 2}
                qkey="groupCoverImage"
            />

            <ImagesModal
                opened={profilePictureModalOpened}
                close={profilePictureModalHandlers.close}
                setImage={setProfilePicture}
                columns={isMobile ? 2 : 3}
                aspectRatio={1 / 1}
                qkey="groupProfilePicture"
            />

            <SmallHeader withArrow title="Vytvoriť skupinu" />

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
                        <Image src={typeof data.coverImage === "string" ? data.coverImage : URL.createObjectURL(data.coverImage)} />
                        : <Box className="no-image"></Box>
                    }
                </AspectRatio>
            </Box>

            <Box px="md" py="sm">
                <Group align="center" gap="xs">
                    <Avatar
                        size="xl"
                        radius="md"
                        className="no-image"
                        src={data.profilePicture && (typeof data.profilePicture === "string" ? data.profilePicture : URL.createObjectURL(data.profilePicture))}
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
                        label="Názov skupiny (povinné)"
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
                        label="Popis skupiny"
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

                <Group mt="sm" justify="space-between">
                    <Stack gap={0}>
                        <Text size="sm">Súkromná skupina</Text>
                        <Text size="xs" c="dimmed">Ak je skupina súkromná, príspevky budú vidieť iba pozvaní používatelia</Text>
                    </Stack>
                    <Switch
                        checked={data.private}
                        onChange={setPrivate}
                    />
                </Group>

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
    );
}