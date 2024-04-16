import { useState } from "react";
import { Box, Group, Button, Loader, Text, Avatar } from '@mantine/core';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Comment from "templates/Comment";
import axios from "axios";

export default function Comments({ postId }) {
    const [isInputOpened, setIsInputOpened] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const editor = useEditor({
        extensions: [StarterKit, Placeholder.configure({ placeholder: "Napíš komentár" })],
        content: "",
    })

    const cancel = () => {
        setIsInputOpened(false)
        editor.commands.clearContent()
    }

    const publish = async () => {
        // Check if empty
        if (editor.getText().trim() === "") return

        setIsPublishing(true)

        await axios.post(`/api/post/${postId}/comment`, {
            postId: postId,
            author: user._id,
            content: editor.getHTML(),
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })

        editor.commands.clearContent()
        setIsInputOpened(false)
        refetch()

        setIsPublishing(false)
    }

    const fetchComments = async () => {
        const response = await axios.get(`/api/post/${postId}/comments`);
        return response.data;
    }

    const { status, data, refetch } = useQuery({
        queryKey: ["comments", postId],
        queryFn: fetchComments,
    });

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
                <Box px="md" py="sm" className="border-bottom">
                    <Group gap="xs" align="flex-start">
                        <Avatar src={user.profilePicture} />

                        <EditorContent
                            editor={editor}
                            onClick={() => setIsInputOpened(true)}
                            style={{ flex: 1 }}
                        />
                    </Group>

                    <Group
                        mt={8}
                        justify="flex-end"
                        gap={4}
                        mah={isInputOpened ? 36 : 0}
                        style={{
                            transition: "max-height 0.15s ease",
                            overflow: "hidden"
                        }}
                    >
                        <Button variant="subtle" color="gray" onClick={cancel}>
                            Zrušiť
                        </Button>
                        <Button onClick={publish} loading={isPublishing} disabled={editor?.getText().trim() === ""}>
                            Komentovať
                        </Button>
                    </Group>
                </Box>
            }

            {data.length === 0 && (
                <Text px="sm" py="lg" c="dimmed">Zatiaľ žiadne komentáre</Text>
            )}

            {data.map(comment => <Comment data={comment} />)}
        </div>
    )
}