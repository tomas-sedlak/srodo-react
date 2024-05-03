import { useEffect, useState } from "react";
import { Box, Group, Button, Loader, Text, Avatar, Textarea } from '@mantine/core';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Comment from "templates/Comment";
import axios from "axios";

export default function Comments({ postId }) {
    const [user, setUser] = useState({});
    const [isInputOpened, setIsInputOpened] = useState(false);
    const [content, setContent] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    const userId = useSelector(state => state.userId);
    const token = useSelector(state => state.token);

    const cancel = () => {
        setIsInputOpened(false)
        setContent("")
    }

    const isValid = () => {
        return content.trim() !== ""
    }

    const publish = async () => {
        if (!isValid()) return

        setIsPublishing(true)

        await axios.post(`/api/post/${postId}/comment`, {
            postId: postId,
            author: userId,
            content: content.trim(),
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        cancel()
        refetch()

        setIsPublishing(false)
    }

    const fetchComments = async () => {
        const response = await axios.get(`/api/post/${postId}/comments`);
        return response.data;
    }

    const fetchUser = async () => {
        if (!userId) return
        const response = await axios.get(`/api/user?userId=${userId}`);
        setUser(response.data)
    }

    const { status, data, refetch } = useQuery({
        queryKey: ["comments", postId],
        queryFn: fetchComments,
    });

    useEffect(() => {
        fetchUser()
    }, [userId]);

    return status === "pending" ? (
        <div className="loader-center-x">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <div id="komentare">
            {user &&
                <Box p="md" className="border-bottom">
                    <Group gap="xs" align="flex-start">
                        <Avatar mt={3} src={user.profilePicture} />

                        <Textarea
                            minRows={1}
                            autosize
                            size="md"
                            placeholder="Napíš komentár"
                            style={{ flex: 1 }}
                            onClick={() => setIsInputOpened(true)}
                            value={content}
                            onChange={event => setContent(event.target.value)}
                        />
                    </Group>

                    <Group
                        justify="flex-end"
                        gap={4}
                        mt={isInputOpened && 8}
                        mah={isInputOpened ? 36 : 0}
                        style={{
                            transition: "max-height 0.15s ease",
                            overflow: "hidden"
                        }}
                    >
                        <Button variant="subtle" color="gray" onClick={cancel}>
                            Zrušiť
                        </Button>
                        <Button onClick={publish} loading={isPublishing} disabled={!isValid()}>
                            Komentovať
                        </Button>
                    </Group>
                </Box>
            }

            {data.length === 0 && (
                <Text px="md" py="sm" c="dimmed">Zatiaľ žiadne komentáre</Text>
            )}

            {data.map(comment => <Comment data={comment} />)}
        </div>
    )
}