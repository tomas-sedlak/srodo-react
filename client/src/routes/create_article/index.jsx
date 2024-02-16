import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Tooltip, Box, Group, Button, Select, AspectRatio, Textarea, Text, Image as MantineImage, ActionIcon, Divider, Menu } from '@mantine/core';
import { IconDots, IconList, IconPhoto, IconChevronDown, IconHeading, IconBold, IconItalic, IconCode, IconStrikethrough, IconClearFormatting, IconLink, IconUnlink, IconBlockquote, IconSubscript, IconSuperscript, IconListNumbers, IconLineDashed } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import ImagesModal from "templates/ImagesModal";
import { useSelector } from "react-redux";
import { createClient } from 'pexels';
import axios from "axios";

import { useEditor } from '@tiptap/react';
import { RichTextEditor, Link } from '@mantine/tiptap';
// import Highlight from '@tiptap/extension-highlight';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';

export default function CreateArticle() {
    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);

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

        fetch("/api/subjects")
            .then(response => response.json())
            .then(json => setSubjects(json))
    }, []);

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
            postType: "article",
            subject: selectedSubject,
            coverImage: coverImage,
            title: title,
            content: editor.getHTML(),
            author: userId,
        }

        await axios.post(
            "/api/post",
            data,
            { headers: { Authorization: `Bearer ${token}` } },
        );
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

                <Select
                    mt="sm"
                    placeholder="Vybrať predmet"
                    data={selectData}
                    onChange={(subjectId) => setSelectedSubject(subjectId)}
                />

                <RichTextEditor editor={editor} mt="sm">
                    <RichTextEditor.Toolbar sticky stickyOffset="var(--header-height)">
                        <Tooltip label="Nadpis">
                            <ActionIcon variant="subtle" color="gray.4" c="black" >
                                <IconHeading stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>
                        <Divider orientation="vertical" />
                        <Tooltip label="Tučné Ctrl+B">
                            <ActionIcon variant="subtle" color="gray.4" c="black" >
                                <IconBold stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Kurzíva Ctrl+I">
                            <ActionIcon variant="subtle" color="gray.4" c="black" >
                                <IconItalic stroke={1.25} />
                            </ActionIcon>
                        </Tooltip>
                        <Menu position="bottom-start">
                            <Menu.Target>
                                <Tooltip label="Viac formátovania">
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconDots stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconStrikethrough stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    Preškrtnuté
                                </Menu.Item>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconCode stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    Kód
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                        {/* <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code /> */}

                        <Divider orientation="vertical" />

                        <Menu position="bottom-start">
                            <Menu.Target>
                                <Tooltip label="Zoznam">
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconList stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconList stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    Odrážky
                                </Menu.Item>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconListNumbers stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    Očíslovaný
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                        <Divider orientation="vertical" />
                        <ActionIcon variant="subtle" color="gray.4" c="black" >
                            <IconLink stroke={1.25} />
                        </ActionIcon>
                        <ActionIcon variant="subtle" color="gray.4" c="black" >
                            <IconUnlink stroke={1.25} />
                        </ActionIcon>
                        <ActionIcon onClick={imageModalHandlers.open} variant="subtle" color="gray.4" c="black">
                            <IconPhoto stroke={1.25} />
                        </ActionIcon>
                        <Menu>
                            <Menu.Target>
                                <ActionIcon variant="subtle" color="gray.4" c="black" >
                                    <IconChevronDown stroke={1.25} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconBlockquote stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconSubscript stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconSuperscript stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black">
                                        <IconLineDashed stroke={1.25} />
                                    </ActionIcon>
                                }>
                                    ...
                                </Menu.Item>
                                <Menu.Item leftSection={
                                    <ActionIcon variant="subtle" color="gray.4" c="black" >
                                        <IconCode stroke={1.25} />
                                    </ActionIcon>
                                }>
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

                <Group gap="sm" mt="sm" justify="flex-end">
                    <Button onClick={publish}>
                        Publikovať článok
                    </Button>
                </Group>
            </Box>
        </>
    );
}