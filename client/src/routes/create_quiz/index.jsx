import { Button, Box, AspectRatio, Image as MantineImage, Flex, Text, Card, Checkbox, ActionIcon, Container, TextInput, UnstyledButton, Group } from "@mantine/core";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Placeholder from '@tiptap/extension-placeholder';
import { IconPhoto, IconPlus } from "@tabler/icons-react";
import ImagesModal from "templates/ImagesModal";
import { useEffect, useState } from "react";
import { createClient } from 'pexels';
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";



export default function CreateQuiz() {

    useEffect(() => {
        client.photos.curated({ per_page: 1, page: 1 }).then(
            response => setCoverImage(response.photos[0].src.landscape)
        )
    });

    const client = createClient('prpnbgyqErzVNroSovGlQyX5Z1Ybl8z3hAEhaingf99gTztS33sMZwg1');
    const [coverImage, setCoverImage] = useState("");
    const [coverImageModalOpened, coverImageModalHandlers] = useDisclosure(false);
    const [imageModalOpened, imageModalHandlers] = useDisclosure(false);

    const addImage = url => {
        editor.chain().focus().setImage({ src: url }).run()
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Napíš otázku" })
        ],
        content: ""
    })

    return (
        <>
            {/* Pictures  */}

            <ImagesModal opened={coverImageModalOpened} close={coverImageModalHandlers.close} setImage={setCoverImage} />
            <ImagesModal opened={imageModalOpened} close={imageModalHandlers.close} setImage={addImage} />

            {/* <Button fullWidth radius="md" variant="outline" leftSection={<IconPhoto stroke={1.25} />} >
            Add photo
        </Button> */}
            <Box p="sm" >
                <Box pos="relative">
                    <AspectRatio ratio={2 / 1}>
                        <MantineImage onClick={coverImageModalHandlers.open} className="pointer" radius="lg" src={coverImage} />
                    </AspectRatio>
                </Box>
                <Flex mt="sm" gap="sm" align="center" >
                    <RichTextEditor
                        editor={editor}
                        style={{ flex: 1 }}
                    >
                        <RichTextEditor.Content />
                    </RichTextEditor>
                    <Button>
                        Pridať otázku
                    </Button>
                </Flex>
                <Card mt="sm" withBorder mb="md" >
                    <Text fw="bold" >Lorem ipsum dolor, sit amet consectetur adipisicing elit.</Text>
                    <>
                        <Flex align="center" gap="sm" p="sm" >
                            <Checkbox />
                            <TextInput placeholder="Add answer" w="100%" />
                        </Flex>
                        <Flex align="center" gap="sm" p="sm" >
                            <Checkbox />
                            <TextInput placeholder="Add answer" w="100%" />
                        </Flex>
                        <Flex align="center" gap="sm" p="sm" >
                            <Checkbox />
                            <TextInput placeholder="Add answer" w="100%" />
                        </Flex>
                        <Flex align="center" gap="sm" p="sm" >
                            <Button
                                variant="subtle"
                                leftSection={<IconPlus stroke={1.25} />}
                                c="black"
                                color="gray"
                                pl={0}
                            >
                                Add a question
                            </Button>
                        </Flex>
                    </>

                </Card>
                <Group gap="lg" grow align="center" >
                    <Button variant="light" color="black">Save as draft</Button>
                    <Button variant="light" color="black">Publish</Button>
                    <Button variant="light" color="black">Add a picture</Button>
                   
                </Group>

            </Box>

        </>
    )
}