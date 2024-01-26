import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, Button } from '@mantine/core';
import Comment from "../templates/comment"
import { Link } from "react-router-dom";
import axios from "axios";

// TipTap editor
import { useEditor } from '@tiptap/react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Article() {
    const [postId] = useLoaderData();
    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const userId = "65b1848bfbb5fbbc9cda4acd";

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Napíš komentár" })
        ],
        content: ""
    })

    const fetchPost = async () => {
        const post = await axios.get(import.meta.env.VITE_API_URL + "/post/" + postId)
        setPost(post.data)
    }

    const fetchComments = async () => {
        const comments = await axios.get(import.meta.env.VITE_API_URL + "/post/" + postId + "/comment")
        setComments(comments.data)
    }

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [])

    return (
        <>
            <Box p="sm" className="border-bottom">
                <AspectRatio ratio={2 / 1}>
                    <Image radius="lg" src={post.coverImage} />
                </AspectRatio>

                <Group gap={4} align="center" mt="sm">
                    <Avatar src={post.author?.profilePicture} />

                    <Link to="username">
                        <Text fw={600} c="gray" size="sm">
                            {post.author?.displayName}
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; {moment(post.createdAt).fromNow()}
                    </Text>
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
                            if (editor.getText().replace(/\s/g,"") !== "") {
                                await axios.post(import.meta.env.VITE_API_URL + "/post/" + postId + "/comment", {
                                    postId: postId,
                                    userId: userId,
                                    content: editor.getHTML(),
                                })

                                fetchComments()
                                editor.commands.clearContent()
                            }
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

export function loader({ params }) {
    return [params.article];
}