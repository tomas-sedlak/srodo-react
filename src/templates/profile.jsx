import { Link } from "react-router-dom";
import { HoverCard, NumberFormatter, Text, Group, Stack, Avatar, Badge } from '@mantine/core';

export default function Profile({ user, size }) {
    return (
        <Group gap="sm">
            <Link to={user.username}>
                <Avatar src={user.profilePicture} size={size} />
            </Link>
            <Stack gap={5}>
                <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                    {user.displayName}
                </Text>
                <Group gap={5}>
                    <Link to={user.username}>
                        <Text
                            c="gray"
                            size="sm"
                            style={{ lineHeight: 1 }}
                        >
                            @{user.username}
                        </Text>
                    </Link>
                    {user.badges.map((badge) => {
                        return (
                            <Badge variant="light" size="sm">{badge}</Badge>
                        )
                    })}
                </Group>
            </Stack>
        </Group>
    )
}

export function ProfileHover({ user }) {
    return (
        <>
            <HoverCard width={320} position="right" withArrow>
                <HoverCard.Target>
                    <Link to={user.username}>
                        <Avatar src={user.profilePicture} />
                    </Link>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Profile user={ user } />
                    <Text size="sm" mt="md">
                        {user.description ? user.description : "No user description"}
                    </Text>
                    <Group mt="md" gap="xl">
                        <Text size="sm">
                            <b><NumberFormatter value={user.posts} thousandSeparator /></b> Posts
                        </Text>
                        <Text size="sm">
                            <b><NumberFormatter value={user.likes} thousandSeparator /></b> Likes
                        </Text>
                    </Group>
                </HoverCard.Dropdown>
            </HoverCard>
            <Stack gap={5}>
                <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                    {user.displayName}
                </Text>
                <Group gap={5}>
                    <Link to={user.username}>
                        <Text
                            c="gray"
                            size="xs"
                            style={{ lineHeight: 1 }}
                        >
                            @{user.username}
                        </Text>
                    </Link>
                    {user.badges.map((badge) => {
                        return (
                            <Badge variant="light" size="sm">{badge}</Badge>
                        )
                    })}
                </Group>
            </Stack>
        </>
    )
}