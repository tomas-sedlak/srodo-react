import { Box, Text, Group, Avatar, TypographyStylesProvider } from '@mantine/core';
import { IconArrowBigUp, IconArrowBigUpFilled, IconArrowBigDown, IconArrowBigDownFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogin, setLoginModal } from "state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Comment({ data }) {
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const upvote = async () => {
        await axios.patch(`/api/comment/${data._id}/upvote`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    const downvote = async () => {
        await axios.patch(`/api/comment/${data._id}/downvote`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    const upvoteMutation = useMutation({
        mutationFn: upvote,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        }
    })

    const downvoteMutation = useMutation({
        mutationFn: downvote,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        }
    })

    return (
        <Box mt={8}>
            <Group gap={8}>
                <Avatar src={data.author.profilePicture} />

                <Group gap={4}>
                    <Link to={"/" + data.author.username}>
                        <Text fw={600} c="gray" size="sm">
                            {data.author.displayName}
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; {moment(data.createdAt).fromNow()}
                    </Text>
                </Group>
            </Group>

            <TypographyStylesProvider p={0} ml={46} mb={8}>
                <div className="user-text" dangerouslySetInnerHTML={{ __html: data.content }} />
            </TypographyStylesProvider>

            <Group ml={46} gap={8}>
                <div className="icon-wrapper">
                    {!data.upvotes.includes(userId) ?
                        <IconArrowBigUp stroke={1.25} onClick={() => userId ? upvoteMutation.mutate : dispatch(setLoginModal(true))} />
                        : <IconArrowBigUpFilled stroke={1.25} onClick={() => userId ? upvoteMutation.mutate : dispatch(setLoginModal(true))} />
                    }
                    <span>{data.upvotes.length - data.downvotes.length}</span>
                    {!data.downvotes.includes(userId) ?
                        <IconArrowBigDown stroke={1.25} onClick={() => userId ? downvoteMutation.mutate : dispatch(setLoginModal(true))} />
                        : <IconArrowBigDownFilled stroke={1.25} onClick={() => userId ? downvoteMutation.mutate : dispatch(setLoginModal(true))} />
                    }
                </div>
            </Group>
        </Box>
    )
}