import { Button, Group, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { IconArrowLeft } from "@tabler/icons-react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export default function SmallHeader({ title = "", withArrow = false, rightSection = null }) {
    const navigate = useNavigate()
    const userId = useSelector(state => state.user?._id)
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <div className="small-header">
            <Group gap={8} h="100%" px="var(--mantine-spacing-md)">
                <Group gap="sm" style={{ flex: 1 }}>
                    {withArrow &&
                        <IconArrowLeft stroke={1.25} className="pointer" onClick={() => navigate(-1)} />
                    }
                    {typeof title === "string" ? <Text fw={600}>{title}</Text> : title}
                </Group>
                {!userId && isMobile ?
                    <Link to="/prihlasenie">
                        <Button>Prihlásiť sa</Button>
                    </Link>
                    : rightSection
                }
            </Group>
        </div>
    )
}