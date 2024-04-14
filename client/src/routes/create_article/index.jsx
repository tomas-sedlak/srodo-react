import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Group, Button, AspectRatio, ActionIcon, Tooltip, Badge } from '@mantine/core';
import { IconCameraPlus } from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { createClient } from 'pexels';
import { TitleInput, SubjectSelect, EditorMenu } from "templates/CreatePostWidgets";
import axios from "axios";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";

export default function CreateArticle() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);
    const isMobile = useMediaQuery("(max-width: 768px)");

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [selectedSubject, setSelectedSubject] = useState();
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Youtube,
            Placeholder.configure({ placeholder: "Tu začni písať svoj článok..." })],
        content: "",
    })

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    }, []);

    const validate = () => {
        let errors = {}

        if (!title) {
            errors.title = "Názov článku je povinný"
        }

        if (!selectedSubject) {
            errors.subject = "Predmet je povinný"
        }

        if (editor.getText().trim().length === 0) {
            errors.text = "Text je povinný"
        }

        return errors ? errors : null
    }

    const publish = async () => {
        setIsPublishing(true)

        const errors = validate()

        if (Object.keys(errors).length !== 0) {
            setError(errors)
            return setIsPublishing(false)
        }

        const data = {
            postType: "article",
            subject: selectedSubject,
            coverImage: coverImage,
            title: title,
            content: editor.getHTML(),
            author: user._id,
        }

        const headers = {
            Authorization: `Bearer ${token}`,
        }

        await axios.post("/api/post", data, { headers });
        navigate("/")
    }

    return (
        <>
            <ImagesModal
                opened={coverImageModalOpened}
                close={coverImageModalHandlers.close}
                setImage={setCoverImage}
                columns={isMobile ? 1 : 2}
                aspectRatio={2 / 1}
            />

            <Box px="md" py="sm">
                <Box pos="relative">
                    <Badge fw={600} className="image-item-left">
                        Článok
                    </Badge>

                    <Tooltip label="Zmeniť obrázok" position="bottom">
                        <ActionIcon
                            className="image-item-right"
                            w={40}
                            h={40}
                            radius="xl"
                            onClick={coverImageModalHandlers.open}
                        >
                            <IconCameraPlus stroke={1.25} />
                        </ActionIcon>
                    </Tooltip>

                    <AspectRatio ratio={2 / 1}>
                        <Box
                            className="lazy-image pointer"
                            style={{ backgroundImage: `url(${coverImage})` }}
                            onClick={coverImageModalHandlers.open}
                        ></Box>
                    </AspectRatio>
                </Box>

                <TitleInput
                    placeholder="Názov článku..."
                    title={title}
                    setTitle={setTitle}
                    error={error.title}
                />

                <SubjectSelect
                    setSelectedSubject={setSelectedSubject}
                    error={error.subject}
                />

                <Box className="text-editor" mt="sm">
                    <EditorMenu editor={editor} />
                    <EditorContent editor={editor} />
                </Box>

                <Group gap="sm" mt="sm" justify="flex-end">
                    <Button onClick={publish} loading={isPublishing}>
                        Publikovať článok
                    </Button>
                </Group>
            </Box>
        </>
    );
}