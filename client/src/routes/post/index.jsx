import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, Button } from '@mantine/core';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Comment from "templates/Comment"

// TipTap editor
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Post() {
    const { postId } = useParams();
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Napíš komentár" })
        ],
        content: ""
    })

    const addView = async () => {
        await axios.patch(`/api/post/${postId}/view`)
    }

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`)
        setPost(post.data)
    }

    const fetchComments = async () => {
        const comments = await axios.get(`/api/post/${postId}/comment`)
        setComments(comments.data)
    }

    useEffect(() => {
        fetchPost()
        // fetchComments()

        const timeoutId = setTimeout(() => {
            addView()
        }, 10000)

        return () => clearTimeout(timeoutId)
    }, [])

    return (
        <>
            <Box p="sm" className="border-bottom">
                <AspectRatio ratio={2 / 1}>
                    <Image radius="lg" src={post.coverImage} />
                </AspectRatio>

                <Group gap="sm" align="center" mt="sm" wrap="nowrap">
                    <Avatar src={post.author?.profilePicture} />

                    <Group gap={4}>
                        <Link to="username">
                            <Text fw={600} c="gray" size="sm">
                                {post.author?.displayName}
                            </Text>
                        </Link>
                        <Text c="gray" size="sm">
                            &middot; {post.subject?.label} &middot; {moment(post.createdAt).fromNow()}
                        </Text>
                    </Group>
                </Group>

                <Title
                    fw={800}
                    fz={32}
                    mt="sm"
                    style={{ lineHeight: 1.2 }}
                >
                    {post.title}
                </Title>

                <TypographyStylesProvider p={0} mt="sm">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </TypographyStylesProvider>
            </Box>

            <Box id="komentare" p="sm" className="border-bottom">

                <Group align="flex-start" gap={8}>
                    <Avatar />

                    <RichTextEditor
                        editor={editor}
                        style={{ flex: 1 }}
                    >
                        <RichTextEditor.Content />
                    </RichTextEditor>
                </Group>

                <Group mt={8} justify="flex-end">
                    <Button
                        onClick={async () => {
                            // Check if not empty
                            // if (editor.getText().replace(/\s/g, "") !== "") {
                            //     await axios.post(`/api/post/${postId}/comment`, {
                            //         postId: postId,
                            //         userId: userId,
                            //         content: editor.getHTML(),
                            //     })

                            //     fetchComments()
                            //     editor.commands.clearContent()
                            // }
                        }}
                    >
                        Publikovať
                    </Button>
                </Group>

                {comments.map(comment => <Comment data={comment} />)}

            </Box>
        </>
    )
}