import { Box, Stack, Text } from "@mantine/core";

export default function Message({ title, content, cta }) {
    return (
        <Stack mx="auto" p="xl" align="center" gap={8} maw={420}>
            {title &&
                <Text ta="center" fw={800} fz={24} style={{ lineHeight: 1.2 }}>{title}</Text>
            }
            {content &&
                <Text ta="center" c="dimmed" style={{ lineHeight: 1.4 }}>{content}</Text>
            }
            {cta &&
                <Box mt="sm">{cta}</Box>
            }
        </Stack>
    )
}