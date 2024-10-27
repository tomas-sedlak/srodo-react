import { Avatar, Text, Group, Stack } from "@mantine/core";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "axios";

export default function GroupList() {
    const userId = useSelector(state => state.user?._id)

    const fetchGroups = async () => {
        if (!userId) return []

        const response = await axios.get(`/api/user/${userId}/groups`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["groups", userId],
        queryFn: fetchGroups,
    })

    return (
        <>
            {userId && status == "success" && data.length > 0 &&
                <Group
                    px="md"
                    py="sm"
                    wrap="nowrap"
                    style={{ overflowX: "auto" }}
                    className="border-bottom"
                >
                    {data.map((group) => (
                        <GroupListItem key={group._id} data={group} />
                    ))}
                </Group>
            }
        </>
    );
};

function GroupListItem({ data }) {
    return (
        <Link to={`/skupiny/${data._id}`}>
            <Stack gap={4} w={84}>
                <Avatar
                    size="xl"
                    radius="md"
                    src={data.profilePicture?.large}
                />

                <Group gap={4} justify="center" wrap="nowrap">
                    <Text
                        size="sm"
                        c="dimmed"
                        style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
                    >
                        {data.name}
                    </Text>

                    {/* Verified icon */}
                    {data.verified &&
                        <svg style={{ flexShrink: 0 }} color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                    }
                </Group>
            </Stack>
        </Link>
    );
};