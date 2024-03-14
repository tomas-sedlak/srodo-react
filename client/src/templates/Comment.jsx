import { Box, Text, Group, Avatar, TypographyStylesProvider, Menu, ActionIcon } from '@mantine/core';
import { IconArrowBigUp, IconArrowBigUpFilled, IconArrowBigDown, IconArrowBigDownFilled, IconDots, IconFlag, IconPencil } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogin, setLoginModal } from "state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
import { IconTrash } from '@tabler/icons-react';
moment.locale("sk");

export default function Comment({ data }) {
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

    const upvoteComment = async () => {
        await axios.patch(`/api/comment/${data._id}/upvote`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    const downvoteComment = async () => {
        await axios.patch(`/api/comment/${data._id}/downvote`,
            { userId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    const deleteComment = async () => {
        await axios.delete(
            `/api/comment/${data._id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
    }

    const upvoteMutation = useMutation({
        mutationFn: upvoteComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        }
    })

    const downvoteMutation = useMutation({
        mutationFn: downvoteComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        }
    })

    return (
        <Box mt={8} pos="relative">
            <Menu position="bottom-end" width={180}>
                <Menu.Target>
                    <ActionIcon
                        className="dots"
                        variant="subtle"
                        color="gray"
                        c="black"
                        radius="xl"
                        w={32}
                        h={32}
                    >
                        <IconDots stroke={1.25} style={{ width: 20, height: 20 }} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {data.author._id === userId ? (
                        <>
                            <Menu.Item>
                                <Link to={`/upravit`}>
                                    <Group>
                                        <IconPencil stroke={1.25} />
                                        <Text>Upraviť</Text>
                                    </Group>
                                </Link>
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item color="red">
                                <Group onClick={deleteMutation.mutate}>
                                    <IconTrash stroke={1.25} />
                                    <Text>Odstrániť</Text>
                                </Group>
                            </Menu.Item>
                        </>
                    ) : (
                        <Menu.Item>
                            <Group>
                                <IconFlag stroke={1.25} />
                                <Text>Nahlásiť</Text>
                            </Group>
                        </Menu.Item>
                    )}
                </Menu.Dropdown>
            </Menu>

            <Group gap="sm" wrap="nowrap">
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
                        <IconArrowBigUp stroke={1.25} onClick={() => userId ? upvoteMutation.mutate() : dispatch(setLoginModal(true))} />
                        : <IconArrowBigUpFilled stroke={1.25} onClick={() => userId ? upvoteMutation.mutate() : dispatch(setLoginModal(true))} />
                    }
                    <span>{data.upvotes.length - data.downvotes.length}</span>
                    {!data.downvotes.includes(userId) ?
                        <IconArrowBigDown stroke={1.25} onClick={() => userId ? downvoteMutation.mutate() : dispatch(setLoginModal(true))} />
                        : <IconArrowBigDownFilled stroke={1.25} onClick={() => userId ? downvoteMutation.mutate() : dispatch(setLoginModal(true))} />
                    }
                </div>
            </Group>
        </Box>
    )
}