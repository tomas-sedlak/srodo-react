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
                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                            {data.author.displayName}
                        </Text>
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