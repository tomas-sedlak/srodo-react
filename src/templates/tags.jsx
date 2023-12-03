import { Link } from "react-router-dom";
import { Group, Button } from '@mantine/core';

export default function Tags({ tags }) {
    return (
        <Group gap={5}>
            {tags.map((tag) => {
                return (
                    <Link to={"tags/" + tag}>
                        <Button
                            component="span"
                            color="dark"
                            size="xs"
                            variant="light"
                        >
                            #{tag}
                        </Button>
                    </Link>
                )
            })}
        </Group>
    )
}