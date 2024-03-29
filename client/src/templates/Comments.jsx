import { useState } from "react";
import { Box, Group, Button, Loader, Text } from '@mantine/core';
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { useQuery } from "@tanstack/react-query";
import { TextEditor } from "templates/CreatePostWidgets";
import { useCurrentEditor } from "@tiptap/react";
import Comment from "templates/Comment";
import axios from "axios";

const PublishButton = ({ postId, refetch }) => {
    const { editor } = useCurrentEditor()
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const [isPublishing, setIsPublishing] = useState(false);

    const publish = async () => {
        if (userId) {
            // Check if empty
            if (editor.getText().trim() === "") return

            setIsPublishing(true)

            await axios.post(`/api/post/${postId}/comment`, {
                postId: postId,
                author: userId,
                content: editor.getHTML(),
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            editor.commands.clearContent()
            refetch()

            setIsPublishing(false)
        } else {
            dispatch(setLoginModal(true))
        }
    }

    return (
        <Group px="sm" pb={8} justify="flex-end">
            <Button onClick={publish} loading={isPublishing}>
                Publikovať
            </Button>
        </Group>
    )
}

export default function Comments({ postId }) {
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
            <Box px="sm">
                <TextEditor
                    placeholder="Napíš komentár"
                    simple
                    slotAfter={
                        <PublishButton postId={postId} refetch={refetch} />
                    }
                />
            </Box>

            <Box p="sm">
                {data.length === 0 && (
                    <Text c="dimmed">Zatiaľ žiadne komentáre</Text>
                )}

                {data.map(comment => <Comment data={comment} />)}
            </Box>
        </>
    )
}