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

                <Text
                    size="sm"
                    ta="center"
                    c="dimmed"
                    style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
                >
                    {data.name}
                </Text>
            </Stack>
        </Link>
    );
};