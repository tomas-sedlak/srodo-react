import { useState } from "react";
import { ActionIcon, Box, Button, Group, Image, Loader, Stack, Tabs, Text, Textarea, Title } from "@mantine/core";
import { Dropzone, MS_POWERPOINT_MIME_TYPE, MS_WORD_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { IconFile, IconUpload, IconX, IconAlarm, IconTrendingUp, IconFileText, IconDevices } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";

const textMaxLength = 5000;

export default function AI() {
    const [isLoading, setIsLoading] = useState(false)
    const [tab, setTab] = useState("text")
    const [text, setText] = useState("")
    const [file, setFile] = useState(null)
    const [image, setImage] = useState(null)
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const userId = useSelector(state => state.user?._id)
    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const generateQuizFromText = async () => {
        setIsLoading(true)
        try {
            const result = await axios.post("/api/ai", { text }, { headers })
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

            const result = await axios.post("/api/ai", formData, { headers })

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

            const result = await axios.post("/api/ai", formData, { headers })
            navigate(`/kviz/${result.data.id}`)
        } catch (err) {
            setError(err.response.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchHistory = async () => {
        try {
            const response = await axios.get("/api/quiz", { headers })
            return response.data
        } catch (err) {
            console.log(err.message)
        }
    }

    const { data, status } = useQuery({
        queryFn: fetchHistory,
        queryKey: ["ai-history", userId],
    })

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
                    <Box px="md" py="xl">
                        <Title ta="center">Interaktívne kvízy ✨</Title>
                        <Text maw={380} mx="auto" mt={8} c="dimmed" ta="center">Vytvor kvíz zo svojich poznámok a preskúšaj svoje vedomosti.</Text >
                    </Box>

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
                                    placeholder="Tu vlož text, z ktorého chceš vytoriť kvíz."
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
                                    <Text mt={4} c="dimmed" size="sm">Podporované formáty sú .pdf, .docx, .pptx, .xlsx. Maximálna veľkosť 5MB.</Text>
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

                    {status === "success" && data.length > 0 &&
                        <Box px="md" py="sm">
                            <Text fw={700} size='lg'>História tvojich kvízov</Text>

                            <Group
                                mt="md"
                                gap={8}
                                wrap="nowrap"
                                style={{ overflowX: "auto" }}
                            >
                                {data.map(quiz => (
                                    <Link to={`/kviz/${quiz._id}`}>
                                        <Group
                                            px="md"
                                            py={8}
                                            className="border background-light"
                                            justify="space-between"
                                            style={{ borderRadius: "var(--mantine-radius-md)" }}
                                        >
                                            <Text style={{ whiteSpace: "nowrap" }}>
                                                {quiz.title}
                                            </Text>
                                        </Group>
                                    </Link>
                                ))}
                            </Group>
                        </Box>
                    }

                    <Box px="md" py="sm">
                        <Text fw={700} size='lg'>Ako to funguje?</Text>

                        <Stack mt="md" gap="sm">
                            <Group gap="sm" wrap="nowrap">
                                <NumberCircle number={1} />
                                <Text><b>Nahraj svoje poznámky </b>ako dokument, prezentáciu alebo obrázok.</Text>
                            </Group>
                            <Group gap="sm" wrap="nowrap">
                                <NumberCircle number={2} />
                                <Text>Šrodo AI automaticky<b> vygeneruje kvíz </b>podľa náhradného obsahu.</Text>
                            </Group>
                            <Group gap="sm" wrap="nowrap">
                                <NumberCircle number={3} />
                                <Text><b>Vypĺň kvíz </b>a zisti svoje skóre.</Text>
                            </Group>
                        </Stack>

                        <Text fw={700} size='lg' mt="lg">Prečo si vybrať šrodo AI?</Text>

                        <Stack mt="md" gap="sm">
                            <Group px="md" py="sm" wrap="nowrap" className="background-light" style={{ borderRadius: "var(--mantine-radius-md)" }}>
                                <IconAlarm stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text style={{ flex: 1 }}><b>Rýchla a jednoduchá príprava na testy: </b>Učte sa presne to, čo potrebujete.</Text>
                            </Group>
                            <Group px="md" py="sm" wrap="nowrap" className="background-light" style={{ borderRadius: "var(--mantine-radius-md)" }}>
                                <IconTrendingUp stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text><b>Vylepšite si svoje vedomosti: </b>Zistite, kde máte medzery, a učte sa efektívnejšie.</Text>
                            </Group>
                            <Group px="md" py="sm" wrap="nowrap" className="background-light" style={{ borderRadius: "var(--mantine-radius-md)" }}>
                                <IconFileText stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text><b>Podpora rôznych formátov: </b>Pracujeme so súbormi ako Word, PDF, PowerPoint a dokonca aj s obrázkami.</Text>
                            </Group>
                            <Group px="md" py="sm" wrap="nowrap" className="background-light" style={{ borderRadius: "var(--mantine-radius-md)" }}>
                                <IconDevices stroke={1.25} style={{ flexShrink: 0 }} />
                                <Text><b>Intuitívne rozhranie: </b>Práca so Šrodo AI je rýchla, jednoduchá a prístupná pre každého.</Text>
                            </Group>
                        </Stack>
                    </Box>
                </>
            )}
        </>
    )
}

function NumberCircle({ number }) {
    return (
        <Group w={32} h={32} justify="center" style={{ backgroundColor: "var(--mantine-primary-color-filled)", borderRadius: "50%", flexShrink: 0 }}>
            <Text span fw={700}>{number}</Text>
        </Group>
    )
}