import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Group, Button, AspectRatio, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { createClient } from 'pexels';
import { TitleInput, SubjectSelect, TextEditor } from "templates/CreatePostWidgets";
import axios from "axios";

export default function CreateArticle() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');
    const user = useSelector(state => state.user);
    const token = useSelector(state => state.token);

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [selectedSubject, setSelectedSubject] = useState();
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);
    const [text, setText] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    }, []);

    const publish = async () => {
        setIsPublishing(true)

        if (!title) {
            setError("Nadpis je povinný")
            return setIsPublishing(false)
        }

        if (!selectedSubject) {
            setError("Predmet je povinný")
            return setIsPublishing(false)
        }

        if (!text) {
            setError("Text je povinný")
            return setIsPublishing(false)
        }

        const data = {
            postType: "article",
            subject: selectedSubject,
            coverImage: coverImage,
            title: title,
            content: text.trim(),
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
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} />

            <Box p="sm">
                <Box pos="relative">
                    <AspectRatio ratio={2 / 1}>
                        <Box
                            className="lazy-image pointer"
                            style={{ backgroundImage: `url(${coverImage})` }}
                            onClick={coverImageModalHandlers.open}
                        ></Box>
                    </AspectRatio>
                </Box>

                <TitleInput
                    title={title}
                    setTitle={setTitle}
                />

                <SubjectSelect
                    setSelectedSubject={setSelectedSubject}
                />

                <TextEditor
                    setText={setText}
                    placeholder="Tu začni písať svoj článok..."
                />

                <Text c="red">{error}</Text>

                <Group gap="sm" mt="sm" justify="flex-end">
                    <Button onClick={publish} loading={isPublishing}>
                        Publikovať článok
                    </Button>
                </Group>
            </Box>
        </>
    );
}