// import { Link } from "react-router-dom";
import { Box, Group, Card, TextInput, Button, Select } from '@mantine/core';
import ImagesModal from "../templates/imagesModal";
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
// import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image'; '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Superscript from '@tiptap/extension-superscript';
// import SubScript from '@tiptap/extension-subscript';

const categories = [
    {
        label: "Matematika",
        link: "/",
        leftSection: "📈"
    },
    {
        label: "Informatika",
        link: "/",
        leftSection: "💻"
    },
    {
        label: "Jazyky",
        link: "/",
        leftSection: "💬"
    },
    {
        label: "Biológia",
        link: "/",
        leftSection: "🧬"
    },
    {
        label: "Chémia",
        link: "/",
        leftSection: "🧪"
    },
    {
        label: "Fyzika",
        link: "/",
        leftSection: "⚡"
    },
    {
        label: "Geografia",
        link: "/",
        leftSection: "🌍"
    },
    {
        label: "Umenie",
        link: "/",
        leftSection: "🎨"
    },
    {
        label: "Šport",
        link: "/",
        leftSection: "💪"
    },
]

export default function Create() {
    const editor = useEditor({
        extensions: [
          StarterKit,
            Image,
        //   Underline,
          Link,
        //   Superscript,
        //   SubScript,
        //   Highlight,
        //   TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({ placeholder: "Here write your text..." })
        ],
        content: ""
      });
    
    return (
        // <main>
            <Box maw={800} p="md" m="auto">
                <Card padding="xl" radius="md" mb="md" m="auto" withBorder>
                    <Group mb="md">
                        <ImagesModal />
                    </Group>

                    <Select
                        placeholder="Select category"
                        data={Array.from(categories, (category) => category.leftSection + " " + category.label)}
                        mb="md"
                    />

                    <TextInput
                        mb="md"
                        placeholder="Post title"
                    />

                    <RichTextEditor editor={editor}>
                        <RichTextEditor.Toolbar sticky stickyOffset={60}>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Underline />
                                <RichTextEditor.Strikethrough />
                                <RichTextEditor.ClearFormatting />
                                <RichTextEditor.Highlight />
                                <RichTextEditor.Code />
                            </RichTextEditor.ControlsGroup>
                    
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H1 />
                                <RichTextEditor.H2 />
                                <RichTextEditor.H3 />
                                <RichTextEditor.H4 />
                            </RichTextEditor.ControlsGroup>
                    
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Blockquote />
                                <RichTextEditor.Hr />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                                <RichTextEditor.Subscript />
                                <RichTextEditor.Superscript />
                            </RichTextEditor.ControlsGroup>
                    
                            <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                            </RichTextEditor.ControlsGroup>
                    
                            <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                            </RichTextEditor.ControlsGroup>
                        </RichTextEditor.Toolbar>
                    
                        <RichTextEditor.Content />
                    </RichTextEditor>
                </Card>
                <Group gap="sm">
                    <Button>
                        Publish
                    </Button>
                    <Button variant="subtle">
                        Save as draft
                    </Button>
                </Group>
            </Box>
        // </main>
    );
}