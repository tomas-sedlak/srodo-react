import { Box, Group, Button, Loader } from '@mantine/core';
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { useQuery } from "@tanstack/react-query";
import Comment from "templates/Comment";
import axios from "axios";

// TipTap editor
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function Comments({ postId }) {
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Napíš komentár" })
        ],
        content: ""
    })

    const fetchComments = async () => {
        const response = await axios.get(`/api/post/${postId}/comments`);
        return response.data;
    }

    const { status, data, refetch } = useQuery({
        queryKey: ["comments"],
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
                            if (userId) {
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
                                    refetch()
                                }
                            } else {
                                dispatch(setLoginModal(true))
                            }
                        }}
                    >
                        Publikovať
                    </Button>
                </Group>
            </Box>

            <Box p="sm">
                {data.map(comment => <Comment data={comment} />)}
            </Box>
        </>
    )
}