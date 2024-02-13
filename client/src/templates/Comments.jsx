import { Box, Group, Button } from '@mantine/core';
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import Comment from "templates/Comment";
import axios from "axios";

// TipTap editor
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function Comments({ comments, postId }) {
    const userId = useSelector(state => state.user._id);
    const token = useSelector(state => state.token);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Napíš komentár" })
        ],
        content: ""
    })

    const fetchComments = async () => {
        await axios.get()
    }

    const { status, data } = useQuery({
        queryKey: ["comments"],
        queryFn: fetchComments,
    });

    return (
        <>
            <Box p="sm" className="border-bottom">
                <RichTextEditor
                    editor={editor}
                    style={{ flex: 1 }}
                >
                    <RichTextEditor.Content />
                </RichTextEditor>

                <Group mt={8} justify="flex-end">
                    <Button
                        onClick={async () => {
                            // Check if not empty
                            if (editor.getText().replace(/\s/g, "") !== "") {
                                await axios.post(`/api/post/${postId}/comment`, {
                                    postId: postId,
                                    author: userId,
                                    content: editor.getHTML(),
                                }, {
                                    headers: { Authorization: `Bearer ${token}` }
                                })

                                editor.commands.clearContent()
                            }
                        }}
                    >
                        Publikovať
                    </Button>
                </Group>
            </Box>

            <Box p="sm">
                {comments?.map(comment => <Comment data={comment} />)}
            </Box>
        </>
    )
}