import { useState } from "react";
import { Box, Group, Button, Loader, Text } from '@mantine/core';
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { useQuery } from "@tanstack/react-query";
import { TextEditor } from "templates/CreatePostWidgets";
import { useCurrentEditor } from "@tiptap/react";
import Comment from "templates/Comment";
import axios from "axios";

const PublishButton = ({ postId, text, refetch }) => {
    const { editor } = useCurrentEditor()
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    return (
        <Group px="sm" pb={8} justify="flex-end">
            <Button
                onClick={async () => {
                    if (userId) {
                        // Check if not empty
                        if (text.trim() !== "") {
                            await axios.post(`/api/post/${postId}/comment`, {
                                postId: postId,
                                author: userId,
                                content: text.trim(),
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
    )
}

export default function Comments({ postId }) {
    const [text, setText] = useState("");

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
        <>
            <Box p="sm" className="border-bottom">
                <TextEditor
                    setText={setText}
                    placeholder="Napíš komentár"
                    simple
                    slotAfter={
                        <PublishButton postId={postId} text={text} refetch={refetch} />
                    }
                />
            </Box>

            <Box p="sm">
                {data.map(comment => <Comment data={comment} />)}
            </Box>
        </>
    )
}