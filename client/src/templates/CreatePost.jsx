import { useState } from "react";
import { ActionIcon, Avatar, Button, Group, Stack, Textarea, Tooltip } from "@mantine/core";
import { IconCopyCheck, IconGif, IconPaperclip, IconPhoto } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";

export default function CreatePost({ groupId }) {
    const queryClient = useQueryClient();
    const [content, setContent] = useState("");
    const [isPublishing, setIsPuhlishing] = useState(false)
    const profilePicture = useSelector(state => state.user?.profilePicture);

    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const isValid = () => {
        return content.trim() !== ""
    }

    const publish = async () => {
        setIsPuhlishing(true)

        const data = {
            groupId,
            content,
        }

        await axios.post("/api/post", data, { headers })
        queryClient.invalidateQueries("post")

        setIsPuhlishing(false)
    }

    return (
        <Group px="md" py="sm" gap="xs" align="Group-start" className="border-bottom">
            <Avatar mt={3} className="no-image" src={profilePicture} />

            <Stack gap={8} style={{ flex: 1 }}>
                <Textarea
                    // variant="unstyled"
                    minRows={1}
                    autosize
                    size="md"
                    placeholder="Napíš niečo..."
                    value={content}
                    onChange={event => setContent(event.target.value)}
                />

                <Group justify="space-between" align="center">
                    <Group gap={8}>
                        <Tooltip label="Obrázok" position="bottom" openDelay={500} withArrow>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                radius="xl"
                            >
                                <IconPhoto stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="GIF" position="bottom" openDelay={500} withArrow>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                radius="xl"
                            >
                                <IconGif stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Súbor" position="bottom" openDelay={500} withArrow>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                radius="xl"
                            >
                                <IconPaperclip stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Kvíz" position="bottom" openDelay={500} withArrow>
                            <ActionIcon
                                variant="transparent"
                                color="gray"
                                radius="xl"
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
            </Stack>
        </Group>
    )
}