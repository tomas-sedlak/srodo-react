import { useEffect, useState } from "react";
import { Group, Select, Tooltip, Box, ActionIcon, Divider, Textarea, Text } from "@mantine/core";
import { IconList, IconPhoto, IconHeading, IconBold, IconItalic, IconCode, IconStrikethrough, IconLink, IconListNumbers, IconVideo } from '@tabler/icons-react';
import axios from "axios";

// Tiptap imports
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";

export function TitleInput({ title, setTitle }) {
    const maxCharacterLenght = 64;
    const [count, setCount] = useState(0);

    return (
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
    )
}

export function SubjectSelect({ setSelectedSubject, selectedSubject }) {
    const [subjects, setSubjects] = useState([])

    const fetchSubjects = async () => {
        const response = await axios.get("/api/subjects")
        setSubjects(response.data)
    }

    useEffect(() => fetchSubjects, [])

    const selectData = []
    subjects.map(subject => {
        selectData.push({
            value: subject._id,
            label: subject.emoji + " " + subject.label,
        })
    })

    return (
        <Select
            mt="sm"
            placeholder="Vybrať predmet"
            data={selectData}
            value={selectedSubject}
            onChange={setSelectedSubject}
        />
    )
}

const EditorMenu = () => {
    const { editor } = useCurrentEditor()

    return (
        <Group className="text-editor-menu">
            <Tooltip label="Nadpis">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <IconHeading stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Tučné">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <IconBold stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Kurzíva">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <IconItalic stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Preškrtnuté">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <IconStrikethrough stroke={1.25} />
                </ActionIcon>
            </Tooltip>

            <Divider orientation="vertical" mx={4} />

            <Tooltip label="Link">
                <ActionIcon variant="subtle" color="gray.4" c="black" >
                    <IconLink stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Odrážky">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <IconList stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Očíslované">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <IconListNumbers stroke={1.25} />
                </ActionIcon>
            </Tooltip>

            <Divider orientation="vertical" mx={4} />

            <Tooltip label="Kód">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <IconCode stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Obrázok">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => {
                        const url = prompt("Image URL")
                        url && editor.commands.setImage({ src: url })
                    }}
                >
                    <IconPhoto stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="YouTube video">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => {
                        const url = prompt("YouTube video URL")
                        url && editor.commands.setYoutubeVideo({ src: url })
                    }}
                >
                    <IconVideo stroke={1.25} />
                </ActionIcon>
            </Tooltip>
        </Group>
    )
}

const EditorMenuSimple = () => {
    const { editor } = useCurrentEditor()

    return (
        <Group className="text-editor-menu">
            <Tooltip label="Tučné">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <IconBold stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Kurzíva">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <IconItalic stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Preškrtnuté">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <IconStrikethrough stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Kód">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                >
                    <IconCode stroke={1.25} />
                </ActionIcon>
            </Tooltip>

            <Divider orientation="vertical" mx={4} />

            <Tooltip label="Odrážky">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <IconList stroke={1.25} />
                </ActionIcon>
            </Tooltip>
            <Tooltip label="Očíslované">
                <ActionIcon
                    variant="subtle" color="gray.4" c="black"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <IconListNumbers stroke={1.25} />
                </ActionIcon>
            </Tooltip>
        </Group>
    )
}

export function TextEditor({ setText, placeholder = "", content = "", slotAfter, simple }) {
    const extensions = [
        StarterKit,
        Image,
        Youtube,
        Placeholder.configure({ placeholder }),
    ]

    return (
        <Box className="text-editor">
            <EditorProvider
                slotBefore={simple ? <EditorMenuSimple /> : <EditorMenu />}
                slotAfter={slotAfter}
                extensions={extensions}
                content={content}
                onUpdate={({ editor }) => setText(editor.getHTML())}
            />
        </Box>
    )
}