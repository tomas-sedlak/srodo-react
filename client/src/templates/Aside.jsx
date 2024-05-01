import { Box, Group, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Link } from "react-router-dom";

export default function Aside() {
    const benefits = [
        "Vytváranie skupín",
        "Pridávanie príspevkov",
        "Komentovanie"
    ]
    return (
        <aside className="aside">
            <Box px="lg" py="md" className="news-card">
                <Text fw={700} size="lg" style={{ lineHeight: 1.2 }}>
                    Vytvor si účet na Šrodovi
                </Text>

                <Box mt="sm">
                    {benefits.map(benefit =>
                        <Group mt={4} gap={8}>
                            <IconCheck color="green" />
                            <span>{benefit}</span>
                        </Group>
                    )}
                </Box>
            </Box>
        </aside>
    )
}