import { forwardRef } from "react";
import { Group, Text, Avatar, Stack } from '@mantine/core';
import { Link } from "react-router-dom";
import MembersDisplay from "./MembersDisplay";

const Suggestion = forwardRef(({ group }, ref) => {
    const groupUrl = `/skupiny/${group._id}`;

    const suggestionContent = (
        <Link to={groupUrl} key={group._id} >
            <Group px="md" py={8} wrap="nowrap" gap="sm">
                <Avatar
                    radius="md"
                    size={96}
                    src={group.profilePicture?.large}
                />

                <Stack gap={0} h={96} miw={0} justify="space-evenly">
                    <Text fw={700} style={{ lineHeight: 1 }}>
                        {group.name}
                    </Text>

                    {group.description && <Text c="dimmed" style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{group.description}</Text>}

                    <MembersDisplay members={group.members} membersCount={group.membersCount} />
                </Stack>
            </Group>
        </Link>
    )

    // Ref is used for infinte scroll. Checks if last group is visible on screen and then loads new posts
    return ref ? <div ref={ref}>{suggestionContent}</div> : suggestionContent
})

export default Suggestion