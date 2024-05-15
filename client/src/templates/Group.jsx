import { forwardRef } from "react";
import { Group, Text, Avatar, Stack } from '@mantine/core';
import { Link } from "react-router-dom";
import { IconLock } from "@tabler/icons-react";
import { IconWorld } from "@tabler/icons-react";

const Suggestion = forwardRef(({ group }, ref) => {
    const groupUrl = `/skupiny/${group._id}`;

    const suggestionContent = (
        <Link to={groupUrl} key={group._id}>
            <Stack px="md" py="sm" gap={0} className="border-bottom">
                <Group justify="space-between">
                    <Group gap="xs">
                        <Avatar className="no-image" src={group.profilePicture?.thumbnail} />

                        <Stack gap={4}>
                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                {group.name}
                            </Text>
                            <Group gap={2}>
                                {group.isPrivate ?
                                    <IconLock color="var(--mantine-color-dimmed)" width={16} height={16} stroke={1.25} />
                                    : <IconWorld color="var(--mantine-color-dimmed)" width={16} height={16} stroke={1.25} />
                                }
                                <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>{group.isPrivate ? "Súkromná" : "Verejná"} skupina</Text>
                            </Group>
                        </Stack>
                    </Group>
                </Group>

                {group.description && <Text mt={8}>{group.description}</Text>}
            </Stack>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last group is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{suggestionContent}</div> : suggestionContent
})

export default Suggestion