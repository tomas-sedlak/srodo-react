import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { IconDownload, IconX } from "@tabler/icons-react";
import byteSize from "byte-size";

export default function FilesDisplay(props) {
    const { files, setFiles } = props;

    return (
        <>
            {files.length > 0 &&
                <Stack gap={4} {...props}>
                    {files.map(file =>
                        <CustomFile file={file} setFiles={setFiles} />
                    )}
                </Stack>
            }
        </>
    )
}

function CustomFile(props) {
    const { file, setFiles } = props;

    return (
        <>
            <a key={file.name} href={!setFiles && file.file} download={file.name} style={{ position: "relative" }}>
                {setFiles &&
                    <ActionIcon
                        variant="default"
                        pos="absolute"
                        top={4}
                        right={4}
                        style={{ borderRadius: "var(--mantine-radius-xl)" }}
                        onClick={() => setFiles(files => files.filter(a => a !== file))}
                    >
                        <IconX stroke={1.25} />
                    </ActionIcon>
                }
                <Group gap="xs" wrap="nowrap" className="file-download">
                    <IconDownload stroke={1.25} />

                    <Stack gap={4} style={{ flex: 1 }}>
                        <Text size="sm" fw={600} style={{ lineHeight: 1, wordBreak: "break-all" }}>{file.name}</Text>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>{`${byteSize(file.size)}`}</Text>
                    </Stack>
                </Group>
            </a>
        </>
    )
}