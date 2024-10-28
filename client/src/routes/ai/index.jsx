import { useState } from "react";
import { ActionIcon, Badge, Box, Button, Card, Group, Image, Loader, Tabs, Text, Textarea, Title } from "@mantine/core";
import { Dropzone, MS_POWERPOINT_MIME_TYPE, MS_WORD_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconFile, IconUpload, IconX, IconAlarm, IconTrendingUp, IconFileText, IconDevices } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";
import { useMediaQuery } from "@mantine/hooks";

const textMaxLength = 5000;

export default function AI() {
    const [isLoading, setIsLoading] = useState(false)
    const [tab, setTab] = useState("text")
    const [text, setText] = useState("")
    const [file, setFile] = useState(null)
    const [image, setImage] = useState(null)
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const isMobile = useMediaQuery("(max-width: 768px)")

    const generateQuizFromText = async () => {
        setIsLoading(true)
        try {
            const result = await axios.post("/api/ai", { text })
            navigate(`/kviz/${result.data.id}`)
        } catch (err) {
            setError(err.response.data.message)
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
            setError(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const generateQuizFromImage = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("image", image)

            const result = await axios.post("/api/ai", formData)
            navigate(`/kviz/${result.data.id}`)
        } catch (err) {
            setError(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Helmet>
                <title>Šrodo AI</title>
                <meta name="description" content="Vytvor interaktívny kvíz zo svojich poznámok a preskúšaj svoje vedomosti." />
            </Helmet>

            <SmallHeader withArrow title="Šrodo AI" />

            {isLoading ? (
                <div className="loader-center">
                    <Loader />
                    <Text>Generujem kvíz</Text>
                </div>
            ) : (
                <>
                    <Title ta="center" mt="md" p="sm"><span style={{ color: 'var(--mantine-primary-color-filled)' }}>AI</span> generované kvízy</Title> {/* Maybe change the color of AI to --mantine-color-pink-filled */}
                    <Text px="md" py="sm" ta="center" c="dimmed">Vytvor interaktívny kvíz zo svojich poznámok a preskúšaj svoje vedomosti.</Text >
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
                            {error && <Text mb="sm" c="red">{error}</Text>}
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
                            {error && <Text mb="sm" c="red">{error}</Text>}
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

                    {tab == "image" &&
                        <Box mx="md" mt="sm">
                            {error && <Text mb="sm" c="red">{error}</Text>}
                            {!image ? (
                                <>
                                    <Dropzone
                                        className="border background-light"
                                        style={{ borderRadius: "var(--mantine-radius-md)" }}
                                        onDrop={(files) => setImage(files[0])}
                                        onReject={(files) => console.log('rejected files', files)}
                                        maxSize={5 * 1024 ** 2}
                                        accept={["image/jpeg", "image/gif", "image/png"]}
                                        multiple={false}
                                    >
                                        <div className="loader-center">
                                            <IconUpload color="var(--mantine-color-dimmed)" size={64} stroke={1} />
                                            <Text c="dimmed" ta="center" px="md">
                                                Potiahni tu obrázok alebo klikni na tlačidlo a nahraj ho
                                            </Text>
                                            <Button variant="default" mt={8}>Pridať súbor</Button>
                                        </div>
                                    </Dropzone>
                                    <Text mt={4} c="dimmed" size="sm">Podporované formáty sú .jpeg, .jpg, .gif, .png. Maximálna veľkosť 5MB.</Text>
                                </>
                            ) : (
                                <Box
                                    pos="relative"
                                    style={{ width: "fit-content", borderRadius: "var(--mantine-radius-lg)" }}
                                    className="border"
                                >
                                    <ActionIcon
                                        variant="default"
                                        pos="absolute"
                                        top={4}
                                        right={4}
                                        style={{ borderRadius: "var(--mantine-radius-xl)" }}
                                        onClick={() => setImage(null)}
                                    >
                                        <IconX stroke={1.25} />
                                    </ActionIcon>
                                    <Image src={URL.createObjectURL(image)} style={{ maxHeight: 400, borderRadius: "var(--mantine-radius-lg)" }} />
                                </Box>
                            )}
                            <Group mt="sm" justify="flex-end">
                                <Button onClick={generateQuizFromImage} disabled={!image}>
                                    Vytvoriť kvíz
                                </Button>
                            </Group>
                        </Box>
                    }
                    <Box m='sm'>
                        <Text fw={700} size='lg'>Ako to funguje?</Text>

                        {isMobile ? (
                            <>
                                <div style={{ justifyContent: 'center', display: 'flex' }}> {/* This is to center the indent circle */}
                                    <Text styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-primary-color-filled)'
                                        }
                                    }}
                                        mt="sm"> {/* It didn't work in index.css, I forced to make it here */}
                                        1
                                    </Text>
                                </div>
                                <Text c="dimmed" ta="center"><span style={{ fontWeight: 'bold' }}>Nahraj svoje poznámky </span>ako dokument, prezentáciu alebo obrázok.</Text>
                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <Text styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-primary-color-filled)'
                                        }
                                    }} mt="sm">
                                        2
                                    </Text>
                                </div>
                                <Text c="dimmed" ta="center">Šrodo AI automaticky<span style={{ fontWeight: 'bold' }}> vygeneruje kvíz </span>podľa náhradného obsahu.</Text>
                                <div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <Text styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-primary-color-filled)'
                                        }
                                    }}
                                        mt="sm">
                                        3
                                    </Text>
                                </div>
                                <Text c="dimmed" ta="center"><span style={{ fontWeight: 'bold' }}>Vypĺň kvíz </span>a zisti svoje skóre.</Text>
                            </>
                        ) : (
                            <>
                                <Group mt="md" wrap="nowrap">
                                    <Text styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-primary-color-filled)',
                                            flexShrink: 0,
                                        }
                                    }}>
                                        1
                                    </Text>
                                    <Text c="dimmed"><span style={{ fontWeight: 'bold' }}>Nahraj svoje poznámky </span>ako dokument, prezentáciu alebo obrázok.</Text>
                                </Group>
                                <Group mt="sm" wrap="nowrap">
                                    <Text styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-primary-color-filled)',
                                            flexShrink: 0,
                                        }
                                    }}>
                                        2
                                    </Text>
                                    <Text c="dimmed">Šrodo AI automaticky<span style={{ fontWeight: 'bold' }}> vygeneruje kvíz </span>podľa náhradného obsahu.</Text>
                                </Group>
                                <Group mt="sm" wrap="nowrap">
                                    <Text styles={{
                                        root: {
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: '50%',
                                            backgroundColor: 'var(--mantine-primary-color-filled)',
                                            flexShrink: 0,
                                        }
                                    }}>
                                        3
                                    </Text>
                                    <Text c="dimmed"><span style={{ fontWeight: 'bold' }}>Vypĺň kvíz </span>a zisti svoje skóre.</Text>
                                </Group>
                            </>
                        )}

                        <Text fw={700} size='lg' mt="lg">Prečo si vybrať šrodo AI?</Text>
                        <Card mt="sm" className="background-light">
                            <Group wrap="nowrap">
                                <IconAlarm stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text style={{ flex: 1 }}><span style={{ fontWeight: 'bold' }}>Rýchla a jednoduchá príprava na testy: </span>Učte sa presne to, čo potrebujete.</Text>
                            </Group>
                        </Card>
                        <Card mt="sm" className="background-light">
                            <Group wrap="nowrap">
                                <IconTrendingUp stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text><span style={{ fontWeight: 'bold' }}>Vylepšite si svoje vedomosti: </span>Zistite, kde máte medzery, a učte sa efektívnejšie.</Text>
                            </Group>
                        </Card>
                        <Card mt="sm" className="background-light">
                            <Group wrap="nowrap">
                                <IconFileText stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text><span style={{ fontWeight: 'bold' }}>Podpora rôznych formátov: </span>Pracujeme so súbormi ako Word, PDF, PowerPoint a dokonca aj s obrázkami.</Text>
                            </Group>
                        </Card>
                        <Card mt="sm" className="background-light">
                            <Group wrap="nowrap">
                                <IconDevices stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text><span style={{ fontWeight: 'bold' }}>Intuitívne rozhranie: </span>Práca so Šrodo AI je rýchla, jednoduchá a prístupná pre každého.</Text>
                            </Group>
                        </Card>
                    </Box>
                </>
            )}
        </>
    )
}