import { Box, Text, Group, Avatar, TypographyStylesProvider } from '@mantine/core';
import { IconArrowBigUp, IconArrowBigUpFilled, IconArrowBigDown, IconArrowBigDownFilled } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Comment({ data }) {
    const userId = useSelector(state => state.user._id);
    const token = useSelector(state => state.token);

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
                        <IconArrowBigUp stroke={1.25} onClick={upvote} />
                        : <IconArrowBigUpFilled stroke={1.25} onClick={upvote} />
                    }
                    <span>{data.upvotes.length - data.downvotes.length}</span>
                    {!data.downvotes.includes(userId) ?
                        <IconArrowBigDown stroke={1.25} onClick={downvote} />
                        : <IconArrowBigDownFilled stroke={1.25} onClick={downvote} />
                    }
                </div>
            </Group>
        </Box>
    )
}