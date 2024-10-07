import { useState } from "react";
import { Box, Button, Group, Loader, Tabs, Text, Textarea } from "@mantine/core";
import { Dropzone, MS_POWERPOINT_MIME_TYPE, MS_WORD_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { useNavigate } from "react-router-dom";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";
import { IconFile, IconUpload, IconX } from "@tabler/icons-react";

const textMaxLength = 5000;

export default function AI() {
    const [isLoading, setIsLoading] = useState(false)
    const [tab, setTab] = useState("text")
    const [text, setText] = useState("")
    const [file, setFile] = useState(null)
    const [image, setImage] = useState(null)
    const navigate = useNavigate()

    const generateQuizFromText = async () => {
        setIsLoading(true)
        try {
            const result = await axios.post("/api/ai", { text })
            navigate(`/kviz/${result.data.id}`)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    const generateQuizFromFile = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
    
            const result = await axios.post("/api/ai", formData)
            navigate(`/kviz/${result.data.id}`)
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <SmallHeader withArrow title="Šrodo AI" />

            {isLoading ? (
                <div className="loader-center">
                    <Loader />
                    <Text>Generujem kvíz</Text>
                </div>
            ) : (
                <>
                    <Text px="md" py="sm">Vytvor interaktívny kvíz zo svojich poznámok a preskúšaj svoje vedomosti.</Text >

                    <Tabs
                        px="md"
                        variant="unstyled"
                        className="border-bottom"
                        value={tab}
                        onChange={setTab}
                    >
                        <Tabs.List className="custom-tabs">
                            <Tabs.Tab value="text">
                                Text
                            </Tabs.Tab>
                            <Tabs.Tab value="file">
                                Súbor
                            </Tabs.Tab>
                            <Tabs.Tab value="image">
                                Obrázok
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>

                    {tab == "text" &&
                        <Box px="md" pt="sm">
                            <Box pos="relative">
                                <Textarea
                                    size="md"
                                    placeholder="Tu vlož text z ktorého chceš vytoriť kvíz."
                                    minRows={8}
                                    maxRows={8}
                                    autosize
                                    value={text}
                                    onChange={(event) => setText(event.currentTarget.value)}
                                    styles={{ input: { paddingRight: 46 } }}
                                    maxLength={textMaxLength}
                                />
                                <Text
                                    size="xs"
                                    c="dimmed"
                                    className="input-counter"
                                >
                                    {text.length}/{textMaxLength}
                                </Text>
                            </Box>
                            <Group mt="sm" justify="flex-end">
                                <Button onClick={generateQuizFromText} disabled={!text}>
                                    Vytvoriť kvíz
                                </Button>
                            </Group>
                        </Box>
                    }

                    {tab == "file" &&
                        <Box mx="md" mt="sm">
                            {!file ? (
                                <>
                                    <Dropzone
                                        className="border background-light"
                                        style={{ borderRadius: "var(--mantine-radius-md)" }}
                                        onDrop={(files) => setFile(files[0])}
                                        onReject={(files) => console.log('rejected files', files)}
                                        maxSize={5 * 1024 ** 2}
                                        accept={[PDF_MIME_TYPE, MS_WORD_MIME_TYPE, MS_POWERPOINT_MIME_TYPE]}
                                        multiple={false}
                                    >
                                        <div className="loader-center">
                                            <IconUpload color="var(--mantine-color-dimmed)" size={64} stroke={1} />
                                            <Text c="dimmed" ta="center" px="md">
                                                Potiahni tu súbor alebo klikni na tlačidlo a nahraj ho
                                            </Text>
                                            <Button variant="default" mt={8}>Pridať súbor</Button>
                                        </div>
                                    </Dropzone>
                                    <Text mt={4} c="dimmed" size="sm">Podporované formáty sú .pfd, .docx, .pptx, .xlsx. Maximálna veľkosť 5MB.</Text>
                                </>
                            ) : (
                                <Group
                                    px="md"
                                    py="sm"
                                    className="border background-light"
                                    justify="space-between"
                                    style={{ borderRadius: "var(--mantine-radius-md)" }}
                                >
                                    <Group gap={8}>
                                        <IconFile stroke={1.25} />
                                        <Text>{file.name}</Text>
                                    </Group>
                                    <IconX stroke={1.25} className="pointer" onClick={() => setFile(null)} />
                                </Group>
                            )}
                            <Group mt="sm" justify="flex-end">
                                <Button onClick={generateQuizFromFile} disabled={!file}>
                                    Vytvoriť kvíz
                                </Button>
                            </Group>
                        </Box>
                    }
                </>
            )}
        </>
    )
}