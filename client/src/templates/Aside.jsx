import { Avatar, Loader, Group, Stack, Text } from "@mantine/core";
import { IconLock, IconWorld } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Aside() {
    const fetchData = async () => {
        const users = await axios.get("/api/user/suggestions");
        const groups = await axios.get("/api/group/suggestions");
        return { users: users.data, groups: groups.data };
    }

    const { status, data } = useQuery({
        queryKey: ["suggested-users"],
        queryFn: fetchData,
    });

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <aside className="aside">
            <div className="news-card">
                <Text px="lg" py="md" fw={700} size="lg" style={{ lineHeight: 1.2 }}>
                    Odporúčaní používatelia
                </Text>

                {data.users.map(user =>
                    <Link to={`/${user.username}`} key={user._id} className="news-card-item">
                        <Group gap="xs">
                            <Avatar className="no-image" src={user.profilePicture.thumbnail} />

                            <Stack gap={4}>
                                <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                    {user.displayName}
                                </Text>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    @{user.username}
                                </Text>
                            </Stack>
                        </Group>
                    </Link>
                )}
            </div>

            <div className="news-card">
                <Text px="lg" py="md" fw={700} size="lg" style={{ lineHeight: 1.2 }}>
                    Odporúčané skupiny
                </Text>

                {data.groups.map(group =>
                    <Link to={`/skupiny/${group._id}`} key={group._id} className="news-card-item">
                        <Group gap="xs">
                            <Avatar className="no-image" src={group.profilePicture.thumbnail} />

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
                    </Link>
                )}
            </div>
        </aside>
    )
}