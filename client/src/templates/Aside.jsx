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
        <>
            <div className="news-card">
                <Text px="lg" py="md" fw={700} size="lg" style={{ lineHeight: 1.2 }}>
                    Odporúčaní používatelia
                </Text>

                {data.users.map(user =>
                    <Link to={`/${user.username}`} key={user._id} className="news-card-item">
                        <Group gap="xs">
                            <Avatar className="no-image" src={user.profilePicture?.thumbnail} />

                            <Stack gap={4}>
                                <Group gap={4}>
                                    <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                        {user.displayName}
                                    </Text>
                                    {/* Verified icon */}
                                    {user.verified &&
                                        <svg color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                    }
                                </Group>
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
                            <Avatar radius="sm" className="no-image" src={group.profilePicture?.thumbnail} />

                            <Stack gap={4}>
                                <Group gap={4}>
                                    <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                        {group.name}
                                    </Text>
                                    {/* Verified icon */}
                                    {group.verified &&
                                        <svg color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                                    }
                                </Group>
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
        </>
    )
}