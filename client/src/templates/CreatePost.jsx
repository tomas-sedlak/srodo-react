import { useState } from "react";
import { ActionIcon, Avatar, Button, Group, Textarea, Tooltip, FileButton, Box, Text } from "@mantine/core";
import { IconCopyCheck, IconGif, IconPaperclip, IconPhoto } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import ImagesDisplay from "./ImagesDisplay";
import FilesDisplay from "./FilesDisplay";
import byteSize from "byte-size";
import axios from "axios";

const maxImageSize = 10000000;
const maxFileSize = 20000000;

export default function CreatePost({ groupId, postId, opened = true }) {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isInputOpened, setIsInputOpened] = useState(opened);
    const [isPublishing, setIsPuhlishing] = useState(false);

    const profilePicture = useSelector(state => state.user?.profilePicture);
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const clear = () => {
        setContent("")
        setImages([])
        setFiles([])
        setError(null)
        setIsInputOpened(opened)
    }

    const handleImageChange = selectedImages => {
        if (images.length + selectedImages.length > 4) {
            setError("Môžeš nahrať maximálne 4 obrázky")
            return
        }

        for (const selectedImage of selectedImages) {
            if (selectedImage.size > maxImageSize) {
                setError(`Maximálna veľkosť obrázka môže byť ${byteSize(maxImageSize)}`)
                return
            }
        }

        setImages([...images, ...selectedImages])
        setError(null)
    }

    const handleFileChange = selectedFiles => {
        if (files.length + selectedFiles.length > 4) {
            setError("Môžeš nahrať maximálne 4 súbory")
            return
        }

        for (const selectedFile of selectedFiles) {
            if (selectedFile.size > maxFileSize) {
                setError(`Maximálna veľkosť súboru môže byť ${byteSize(maxFileSize)}`)
                return
            }
        }

        setFiles([...files, ...selectedFiles])
        setError(null)
    }

    const isValid = () => {
        return content.trim() !== "" || images.length > 0 || files.length > 0;
    }

    const publish = async () => {
        setIsPuhlishing(true)

        try {
            const formData = new FormData()
            groupId && formData.append("group", groupId)
            postId && formData.append("postId", postId)
            formData.append("content", content)
            for (const image of images) {
                formData.append("images", image)
            }
            for (const file of files) {
                formData.append("files", file)
            }

            groupId && await axios.post("/api/post", formData, { headers })
            postId && await axios.post("/api/comment", formData, { headers })

            clear()
            groupId && await queryClient.invalidateQueries("posts")
            postId && await queryClient.invalidateQueries("comments")

            notifications.show({
                title: `${groupId ? "Príspevok" : "Komentár"} úspešne pridaný`,
            })
        } catch (err) {
            console.log(err.message)
        }

        setIsPuhlishing(false)
    }

    return (
        <Group px="md" py="sm" gap="xs" align="Group-start" wrap="nowrap" className="border-bottom">
            <Avatar mt={3} className="no-image" src={profilePicture?.thumbnail} />

            <Box style={{ flex: 1 }}>
                <Textarea
                    minRows={1}
                    autosize
                    size="md"
                    placeholder="Napíš niečo..."
                    value={content}
                    onClick={() => setIsInputOpened(true)}
                    onChange={event => setContent(event.target.value)}
                />

                <ImagesDisplay mt={8} images={images} setImages={setImages} withCloseButtons />

                <FilesDisplay mt={8} files={files} setFiles={setFiles} withCloseButtons />

                <Group
                    justify="space-between"
                    gap={4}
                    mt={isInputOpened && 8}
                    mah={isInputOpened ? 36 : 0}
                    style={{
                        transition: "max-height 0.15s ease",
                        overflow: "hidden"
                    }}
                >
                    <Group gap={8}>
                        <FileButton onChange={handleImageChange} multiple accept="image/png,image/jpeg">
                            {props =>
                                <Tooltip label="Obrázok" position="bottom" openDelay={500} withArrow>
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        {...props}
                                    >
                                        <IconPhoto stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>
                            }
                        </FileButton>

                        <Tooltip label="GIF" position="bottom" openDelay={500} withArrow>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                disabled
                            >
                                <IconGif stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>

                        <FileButton onChange={handleFileChange} multiple>
                            {props =>
                                <Tooltip label="Súbor" position="bottom" openDelay={500} withArrow>
                                    <ActionIcon
                                        variant="transparent"
                                        color="gray"
                                        {...props}
                                    >
                                        <IconPaperclip stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>
                            }
                        </FileButton>

                        <Tooltip label="Kvíz" position="bottom" openDelay={500} withArrow>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                disabled
                            >
                                <IconCopyCheck stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>

                    <Button
                        onClick={publish}
                        disabled={!isValid()}
                        loading={isPublishing}
                    >
                        Publikovať
                    </Button>
                </Group>

                {error && <Text mt={8} size="sm" c="red">{error}</Text>}
            </Box>
        </Group>
    )
}