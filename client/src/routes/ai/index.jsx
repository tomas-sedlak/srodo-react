import { Box, Button, Group, Loader, Tabs, Text, Textarea } from "@mantine/core";
import axios from "axios";
import { useState } from "react";
import SmallHeader from "templates/SmallHeader";

const textMaxLength = 5000;

export default function AI() {
    const [isLoading, setIsLoading] = useState(false)
    const [tab, setTab] = useState("text")
    const [text, setText] = useState("")

    const generateQuiz = async () => {
        setIsLoading(true)

        try {
            const result = await axios.post("/api/ai", { text })
            console.log(result.data)
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
                        <Box px="md" py="sm">
                            <Box pos="relative">
                                <Textarea
                                    size="md"
                                    placeholder="Tu vlož text z ktorého cheš vytoriť kvíz."
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
                        </Box>
                    }

                    <Group px="md" justify="flex-end">
                        <Button onClick={generateQuiz} disabled={!text}>
                            Vytvoriť kvíz
                        </Button>
                    </Group>
                </>
            )}
        </>
    )
}