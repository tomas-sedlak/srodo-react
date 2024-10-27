import { useState } from 'react';
import { Text, Group, Avatar, Spoiler, Stack, Badge } from '@mantine/core';
import { IconArrowBigUp, IconArrowBigUpFilled, IconArrowBigDown, IconArrowBigDownFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { PostMenu } from './PostWidgets';
import ImagesDisplay from './ImagesDisplay';
import FilesDisplay from './FilesDisplay';
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Comment({ data, owner }) {
    const authorUrl = `/${data.author.username}`;
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const dispatch = useDispatch();

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

    return (
        <Group px="md" py="sm" gap="xs" align="flex-start" pos="relative" wrap="nowrap" className="border-bottom">
            <Link to={`/${data.author.username}`}>
                <Avatar className="no-image" src={data.author.profilePicture?.thumbnail} />
            </Link>

            <PostMenu type="comment" post={data} />

            <Stack gap={0} pos="relative" style={{ flex: 1 }}>
                <Group mb={4} pr={32} gap={4}>
                    <Link to={authorUrl}>
                        <Group gap={4}>
                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                {data.author.displayName}
                            </Text>
                            {/* Verified icon */}
                            {data.author.verified &&
                                <svg color="var(--mantine-primary-color-filled)" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-rosette-discount-check"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>
                            }
                        </Group>
                    </Link>
                    {data.author._id === owner &&
                        <Badge variant="light" size="xs">Admin</Badge>
                    }
                    <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                        &middot;
                    </Text>
                    <Text c="dimmed" size="sm" style={{ lineHeight: 1 }}>
                        {moment(data.createdAt).fromNow()}
                    </Text>
                </Group>

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

                <ImagesDisplay mt={8} images={data.images} />

                <FilesDisplay mt={8} files={data.files} />

                <Group mt={8} gap={4}>
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