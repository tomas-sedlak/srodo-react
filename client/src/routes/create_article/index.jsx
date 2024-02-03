import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Group, Button, Select, AspectRatio, Textarea, Text, Image as MantineImage } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
// import Highlight from '@tiptap/extension-highlight';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';
import ImagesModal from "templates/imagesModal";
import TextEditor from "templates/TextEditor";
import { createClient } from 'pexels';
import axios from "axios";

export default function CreateArticle() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');

    const maxCharacterLenght = 64;
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const [coverImage, setCoverImage] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState();
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )

        fetch(import.meta.env.VITE_API_URL + "/subjects")
            .then(response => response.json())
            .then(json => setSubjects(json))
    }, []);

    const addImage = url => {
        editor.chain().focus().setImage({ src: url }).run()
    }

    const addVideo = () => {
        const url = prompt("URL")

        editor.commands.setYoutubeVideo({
            src: url,
        })
    }

    const publish = async () => {
        const data = {
            type: "article",
            subjectId: selectedSubject,
            coverImage: coverImage,
            title: title,
            content: editor.getHTML(),
            authorId: "65b1848bfbb5fbbc9cda4acd",
        }

        axios.post(import.meta.env.VITE_API_URL + "/create", data)
        navigate("/")
    }

    const selectData = []
    subjects.map((subject) => {
        selectData.push({
            value: subject._id,
            label: subject.emoji + " " + subject.label,
        })
    })

    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} setImage={addImage} />

            <Box p="sm">
                <Box pos="relative">
                    <AspectRatio ratio={2 / 1}>
                        <MantineImage onClick={coverImageModalHandlers.open} className="pointer" radius="lg" src={coverImage} />
                    </AspectRatio>
                </Box>

                <Textarea
                    autosize
                    mt="md"
                    w="100%"
                    variant="unstyled"
                    placeholder="Názov článku"
                    styles={{
                        input: {
                            fontSize: "32px",
                            fontWeight: "800"
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
                <Text c="gray" size="sm" ta="end">{count}/{maxCharacterLenght}</Text>

                <Select
                    mt="sm"
                    placeholder="Vybrať predmet"
                    data={selectData}
                    onChange={(subjectId) => setSelectedSubject(subjectId)}
                />

                <TextEditor />

                <Group gap="sm" mt="lg">
                    <Button onClick={publish}>
                        Publikovať článok
                    </Button>
                </Group>
            </Box>
        </>
    );
}