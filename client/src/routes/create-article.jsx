// import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Box, Group, Card, TextInput, Button, Select, Badge, AspectRatio, Image as MantineImage, Textarea, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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

    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const [coverImage, setCoverImage] = useState("");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);

    useEffect(() => {
        client.photos.curated({ per_page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
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

    const publish = () => {
        const data = {
            image: coverImage,
            title: title,
            content: editor.getHTML(),
            author: "658f13c1a41b9463468b8118",
        }

        fetch(import.meta.env.VITE_API_URL + "/create/article", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(console.log("success"))
    }

    const keyhandler = e => {
        setCount(e.target.value.length);
        // blocking ENTER (it did NOT work lol)
        // if(e. === 'Enter') {
        //      e.preventDefault();
        // }
      };

    

    const MaxCharacterLenght = 64

    return (
        <>
            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} setImage={addImage} />

            <Box maw={600} m="auto" pt="lg">
                <Card padding="md" mb="md" className="custom-card">
                    <Card.Section>
                        <div className="image-item-left">
                            <Badge color="black" c="white" variant="light">Článok</Badge>
                        </div>
                        <div className="image-item-right">
                            <Button onClick={coverImageModalHandlers.open}>
                                Nahrať obrázok
                            </Button>
                        </div>
                        <AspectRatio ratio={650 / 273}>
                            <MantineImage src={coverImage} />
                        </AspectRatio>
                    </Card.Section>

                    {/* OLD title input */}
                    {/* <TextInput
                        mt="md"
                        variant="unstyled"
                        placeholder="Názov článku"
                        className="title-input"
                        value={title}
                        onChange={event => { setTitle(event.currentTarget.value) }}
                    /> */}

                    {/* NEW title input */}
                    <Textarea
                        autosize 
                        mt="md"
                        w="100%"
                        variant="unstyled"
                        placeholder="Názov článku"
                        className="title-input"
                        value={title}
                        maxLength={MaxCharacterLenght} 
                        onInput={e => keyhandler(e)} 
                        onChange={event => {
                            setTitle(event.target.value)
                            
                        }}
                        
                        onKeyDown={function(e){  // This is should be in the KeyHandler but I didn't find a way to put it there xd
                            if(e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    />
                    <Text c="dimmed" w="100%" ta="end">{count}/{MaxCharacterLenght}</Text>
                   


                    <Select
                        placeholder="Vybrať predmet"
                        data={Array.from(categories, (category) => category.leftSection + " " + category.label)}
                        mt="md"
                    />

                    <RichTextEditor editor={editor} mt="md">
                        <RichTextEditor.Toolbar sticky>
                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.H3 />
                                <RichTextEditor.Bold />
                                <RichTextEditor.Italic />
                                <RichTextEditor.Underline />
                                <RichTextEditor.Strikethrough />
                                <RichTextEditor.ClearFormatting />
                                <RichTextEditor.Highlight />
                                <RichTextEditor.Code />
                            </RichTextEditor.ControlsGroup>

                            <RichTextEditor.ControlsGroup>
                                <RichTextEditor.Blockquote />
                                <RichTextEditor.Hr />
                                <RichTextEditor.BulletList />
                                <RichTextEditor.OrderedList />
                                <RichTextEditor.Subscript />
                                <RichTextEditor.Superscript />
                                <button onClick={imageModalHandlers.open}>Obrázok</button>
                                <button onClick={addVideo}>Video</button>
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

                    <Group gap="sm" mt="md">
                        <Button onClick={publish}>
                            Vytvoriť
                        </Button>
                    </Group>
                </Card>
            </Box>
        </>
    );
}