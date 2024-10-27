import { useEffect, useState } from 'react';
import { Box, Group, Button, AspectRatio, TextInput, Text, Textarea, Avatar, Image, Loader } from '@mantine/core';
import { IconCamera, IconTrash } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import ImagesModal from "templates/ImagesModal";
import axios from 'axios';
import SmallHeader from 'templates/SmallHeader';

const nameMaxLength = 64;
const descriptionMaxLength = 160;

export default function EditGroup() {
    const { groupId } = useParams();
    const queryClient = useQueryClient();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const navigate = useNavigate();
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [profilePictureModalOpened, profilePictureModalHandlers] = useDisclosure(false);
    const [isLoading, setIsLoading] = useState(true);
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

    const update = async () => {
        setIsPublishing(true)

        try {
            const formData = new FormData();
            data.coverImage != originalData.coverImage && formData.append("coverImage", data.coverImage);
            data.profilePicture != originalData.profilePicture && formData.append("profilePicture", data.profilePicture);
            data.name != originalData.name && formData.append("name", data.name);
            data.description != originalData.description && formData.append("description", data.description);

            await axios.patch(`/api/group/${groupId}/update`, formData, { headers });
            await queryClient.invalidateQueries("groups");
            navigate(`/skupiny/${groupId}`);

            notifications.show({
                title: "Zmeny boli uložené",
            });
        } catch (err) {
            console.log(err)
        }

        setIsPublishing(false)
    }

    const fetchGroup = async () => {
        const response = await axios(`/api/group/${groupId}`, { headers })
        setData({
            coverImage: response.data.coverImage,
            profilePicture: response.data.profilePicture?.large,
            name: response.data.name,
            description: response.data.description,
            isPrivate: response.data.isPrivate,
        })
        setOriginalData({
            coverImage: response.data.coverImage,
            profilePicture: response.data.profilePicture?.large,
            name: response.data.name,
            description: response.data.description,
            isPrivate: response.data.isPrivate,
        })
        setIsLoading(false)
    }

    useEffect(() => {
        fetchGroup()
    }, [])

    return isLoading ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : (
        <>
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

            <SmallHeader withArrow title="Upraviť skupinu" />

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

                <Group mt="md">
                    <Button
                        ml="auto"
                        loading={isPublishing}
                        onClick={update}
                        disabled={JSON.stringify(data) == JSON.stringify(originalData)}
                    >
                        Uložiť zmeny
                    </Button>
                </Group>
            </Box>
        </>
    );
}