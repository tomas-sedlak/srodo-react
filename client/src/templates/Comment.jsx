import { useState } from 'react';
import { Text, Group, Avatar, Menu, ActionIcon, Spoiler, Stack, Tooltip } from '@mantine/core';
import { IconArrowBigUp, IconArrowBigUpFilled, IconArrowBigDown, IconArrowBigDownFilled, IconDots, IconFlag, IconPencil, IconTrash } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modals } from '@mantine/modals';
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk")
// moment.locale("sk", {
//     relativeTime: {
//         ss: "%ss",
//         mm: "%dm",
//         hh: "%dh",
//         dd: "%dd",
//         MM: "%dM",
//         yy: "%dY",
//     }
// });

export default function Comment({ data }) {
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [votes, setVotes] = useState(data.upvotes.length - data.downvotes.length);
    const [upvote, setUpvote] = useState(data.upvotes.includes(userId));
    const [downvote, setDownvote] = useState(data.downvotes.includes(userId));

    const headers = {
        Authorization: `Bearer ${token}`
    }

    const upvoteComment = async () => {
        upvote ? setVotes(votes - 1) : downvote ? setVotes(votes + 2) : setVotes(votes + 1)
        setUpvote(!upvote)
        setDownvote(false)

        await axios.patch(
            `/api/comment/${data._id}/upvote`, { userId }, { headers },
        );
    }

    const downvoteComment = async () => {
        downvote ? setVotes(votes + 1) : upvote ? setVotes(votes - 2) : setVotes(votes - 1)
        setDownvote(!downvote)
        setUpvote(false)

        await axios.patch(
            `/api/comment/${data._id}/downvote`, { userId }, { headers },
        );
    }

    const deleteComment = async () => {
        await axios.delete(
            `/api/comment/${data._id}`, { headers },
        );
    }

    const deleteMutation = useMutation({
        mutationFn: deleteComment,
        onSuccess: () => {
            queryClient.invalidateQueries(["comments"]);
        }
    })

    return (
        <Group px="md" py="sm" gap="xs" align="flex-start" className="border-bottom">
            <Link to={`/${data.author.username}`}>
                <Avatar src={data.author.profilePicture} />
            </Link>

            <Stack gap={4} pos="relative" style={{ flex: 1 }}>
                <Group gap={4}>
                    <Link to={"/" + data.author.username}>
                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                            {data.author.displayName}
                        </Text>
                    </Link>
                    <Link to={"/" + data.author.username}>
                        <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                            @{data.author.username}
                        </Text>
                    </Link>
                    <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                        &middot;
                    </Text>
                    <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                        {moment(data.createdAt).fromNow()}
                    </Text>
                </Group>

                <Menu position="bottom-end" width={180}>
                    <Menu.Target>
                        <ActionIcon
                            className="dots"
                            variant="subtle"
                            color="gray"
                            c="var(--mantine-color-text)"
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
                                <Menu.Item
                                    onClick={() => navigate(`/upravit`)}
                                    leftSection={<IconPencil stroke={1.25} />}
                                >
                                    <Text>Upraviť</Text>
                                </Menu.Item>

                                <Menu.Divider />

                                <Menu.Item
                                    color="red"
                                    onClick={() => modals.openConfirmModal({
                                        title: "Zmazať komentár",
                                        children: <Text>Určite chceš zmazať tento komentár?</Text>,
                                        centered: true,
                                        labels: { confirm: "Zmazať", cancel: "Zrušiť" },
                                        confirmProps: { color: "red" },
                                        onConfirm: () => deleteMutation.mutate(),
                                    })}
                                    leftSection={<IconTrash stroke={1.25} />}
                                >
                                    <Text>Odstrániť</Text>
                                </Menu.Item>
                            </>
                        ) : (
                            <Menu.Item leftSection={<IconFlag stroke={1.25} />}>
                                <Text>Nahlásiť</Text>
                            </Menu.Item>
                        )}
                    </Menu.Dropdown>
                </Menu >

                <Spoiler
                    maxHeight={100}
                    hideLabel="Zobraziť menej"
                    showLabel="Zobraziť viac"
                    styles={{
                        control: { color: "var(--mantine-color-dimmed)" },
                    }}
                >
                    <div style={{ whiteSpace: "pre-line" }}>
                        {data.content}
                    </div>
                </Spoiler>

                <Group gap={8}>
                    <div className="icon-wrapper">
                        {!upvote ?
                            <IconArrowBigUp stroke={1.25} onClick={() => userId ? upvoteComment() : dispatch(setLoginModal(true))} />
                            : <IconArrowBigUpFilled stroke={1.25} onClick={() => userId ? upvoteComment() : dispatch(setLoginModal(true))} />
                        }
                        <span>{votes}</span>
                        {!downvote ?
                            <IconArrowBigDown stroke={1.25} onClick={() => userId ? downvoteComment() : dispatch(setLoginModal(true))} />
                            : <IconArrowBigDownFilled stroke={1.25} onClick={() => userId ? downvoteComment() : dispatch(setLoginModal(true))} />
                        }
                    </div>
                </Group>
            </Stack>
        </Group>
    )
}