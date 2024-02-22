import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Group, Button, AspectRatio, Textarea, Text, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { createClient } from 'pexels';
import { SubjectSelect, TextEditor } from "templates/CreatePostWidgets";
import { useCurrentEditor } from "@tiptap/react";
import axios from "axios";

export default function CreateArticle() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);

    const maxCharacterLenght = 64;
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const [coverImage, setCoverImage] = useState("");
    const [selectedSubject, setSelectedSubject] = useState();
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);
    const [text, setText] = useState("");

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    }, []);

    const publish = async () => {
        const data = {
            postType: "article",
            subject: selectedSubject,
            coverImage: coverImage,
            title: title,
            content: text,
            author: userId,
        }

        await axios.post(
            "/api/post",
            data,
            { headers: { Authorization: `Bearer ${token}` } },
        );
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

                <Box pos="relative">
                    <Textarea
                        autosize
                        mt="md"
                        w="100%"
                        variant="unstyled"
                        placeholder="Názov článku"
                        styles={{
                            input: {
                                fontSize: "32px",
                                fontWeight: "800",
                                lineHeight: 1.2,
                                borderRadius: 0,
                                padding: 0,
                                paddingRight: 36,
                            },
                        }}
                        value={title}
                        maxLength={maxCharacterLenght}
                        onChange={event => {
                            setTitle(event.target.value)
                            setCount(event.target.value.length)
                        }}
                        onKeyDown={event => event.key === "Enter" && event.preventDefault()}
                    />
                    <Text c="gray" size="sm" className="input-counter">{count}/{maxCharacterLenght}</Text>
                </Box>

                <SubjectSelect setSelectedSubject={setSelectedSubject} />

                <TextEditor setText={setText} placeholder="Tu začni písať svoj článok..." />

                <Group gap="sm" mt="sm" justify="flex-end">
                    <Button onClick={publish}>
                        Publikovať článok
                    </Button>
                </Group>
            </Box>
        </>
    );
}