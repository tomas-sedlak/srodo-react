import { useState } from "react";
import { ActionIcon, Avatar, Button, Group, Textarea, Tooltip, Image, FileButton, Box } from "@mantine/core";
import { IconCopyCheck, IconGif, IconPaperclip, IconPhoto } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { DownloadFile } from "./PostWidgets";
import axios from "axios";

export default function CreatePost({ groupId, postId, opened = true }) {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
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
        setIsInputOpened(opened)
    }

    const isValid = () => {
        return content.trim() !== ""
    }

    const publish = async () => {
        setIsPuhlishing(true)

        try {
            const formData = new FormData()
            groupId && formData.append("groupId", groupId)
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
            groupId && queryClient.invalidateQueries("posts")
            postId && queryClient.invalidateQueries("comments")
        } catch (err) {
            console.log(err.message)
        }

        setIsPuhlishing(false)
    }

    return (
        <Group px="md" py="sm" gap="xs" align="Group-start" className="border-bottom">
            <Avatar mt={3} className="no-image" src={profilePicture} />

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

                {images.length > 0 &&
                    images.map(image =>
                        <Image radius="lg" src={URL.createObjectURL(image)} />
                    )
                }

                {files.length > 0 &&
                    <Group gap={8}>
                        {files.map(file =>
                            <DownloadFile file={file} />
                        )}
                    </Group>
                }

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
                        <FileButton onChange={setImages} multiple accept="image/png,image/jpeg">
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

                        <FileButton onChange={setFiles} multiple accept="text/csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain">
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
            </Box>
        </Group>
    )
}