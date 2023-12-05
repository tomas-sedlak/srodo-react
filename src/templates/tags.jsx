import { Link } from "react-router-dom";
import { Group, Button } from '@mantine/core';

export default function Tags({ tags }) {
    return (
        // <Group gap={0}>
        <>
            {tags.map((tag) => {
                return (
                    <Link to={"tags/" + tag}>
                        <Button
                            variant="subtle"
                            color="gray"
                            fw={400}
                            px={8}
                        >
                            #{tag}
                        </Button>
                    </Link>
                )
            })}
        </>
        // </Group>
    )
}