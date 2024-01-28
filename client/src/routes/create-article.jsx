import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Group, Button, Select, AspectRatio, Image as MantineImage, Textarea, Text, Divider, Menu, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDots, IconList, IconPhoto, IconChevronDown, IconLetterCase, IconBold, IconItalic, IconUnderline, IconHighlight, IconStrikethrough, IconClearFormatting, IconLink, IconUnlink, IconBlockquote, IconSubscript, IconSuperscript, IconCode, IconListNumbers, IconLineDashed } from '@tabler/icons-react';
import ImagesModal from "../templates/imagesModal";
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
// import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';
import { createClient } from 'pexels';
import axios from "axios";

export default function CreateArticle() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
            Youtube,
            // Underline,
            Link,
            // Superscript,
            // SubScript,
            // Highlight,
            //   TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: "Tu začni písať svoj článok..." })
        ],
        content: ""
    });

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
                    // className="title-input"
                    styles={{
                        input: {
                            fontSize: "32px",
                            fontWeight: "700"
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
                {/* Character counter for Textarea */}
                <Text c="gray" size="sm" ta="end">{count}/{maxCharacterLenght}</Text>

                <Select
                    mt="sm"
                    placeholder="Vybrať predmet"
                    data={selectData}
                    onChange={(subjectId) => setSelectedSubject(subjectId)}
                />

                <RichTextEditor editor={editor} mt="sm">
                    <RichTextEditor.Toolbar sticky stickyOffset="var(--header-height)">
                        <ActionIcon variant="subtle" color="gray.4" ><IconLetterCase stroke={1.25} color="black" /></ActionIcon>
                        <Divider orientation="vertical" />
                        <ActionIcon variant="subtle" color="gray.4" ><IconBold stroke={1.25} color="black" /></ActionIcon>
                        <ActionIcon variant="subtle" color="gray.4" ><IconItalic stroke={1.25} color="black" /></ActionIcon>
                        <Menu>
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray.4" radius={0} ><IconDots stroke={1.25} color="black" /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>

                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconUnderline stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconHighlight stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconStrikethrough stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconClearFormatting stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        {/* <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code /> */}

                        <Divider orientation="vertical" />

                        <Menu>
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray.4" ><IconList stroke={1.25} color="black" /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconList stroke={1.25} color="black" /></ActionIcon>} >
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconListNumbers stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <Divider orientation="vertical" />
                        <ActionIcon variant="subtle" color="gray.4" ><IconLink stroke={1.25} color="black" /></ActionIcon>
                        <ActionIcon variant="subtle" color="gray.4" ><IconUnlink stroke={1.25} color="black" /></ActionIcon>
                        <ActionIcon onClick={imageModalHandlers.open} variant="subtle" color="gray.4"><IconPhoto stroke={1.25} color="black" /></ActionIcon>
                        <Menu>
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray.4"><IconChevronDown stroke={1.25} color="black" /></ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconBlockquote stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconSubscript stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconSuperscript stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconLineDashed stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={<ActionIcon variant="subtle" color="gray.4" ><IconCode stroke={1.25} color="black" /></ActionIcon>}>
                                    ...
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        {/*                      
                        <button onClick={imageModalHandlers.open}>Obrázok</button>
                        <button onClick={addVideo}>Video</button> */}

                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>

                <Group gap="sm" mt="lg">
                    <Button onClick={publish}>
                        Publikovať článok
                    </Button>
                </Group>
            </Box>
        </>
    );
}