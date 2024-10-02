import { Group, Text } from "@mantine/core"
import { IconArrowLeft } from "@tabler/icons-react"
import { useNavigate } from "react-router-dom"

export default function SmallHeader({ title = "", withArrow = false }) {
    const navigate = useNavigate()

    return (
        <div className="small-header">
            <Group gap="sm" h="100%" px="var(--mantine-spacing-md)">
                {withArrow &&
                    <IconArrowLeft className="pointer" onClick={() => navigate(-1)} />
                }
                {typeof title === "string" ? <Text fw={600}>{title}</Text> : title}
            </Group>
        </div>
    )
}