import { Box, Text } from "@mantine/core";

export default function Message({ title, content }) {
    return (
        <Box mx="auto" p="xl" maw={420}>
            <Text ta="center" fw={800} fz={24} style={{ lineHeight: 1.2 }}>{title}</Text>
            <Text ta="center" c="dimmed" mt={8} style={{ lineHeight: 1.2 }}>{content}</Text>
        </Box>
    )
}