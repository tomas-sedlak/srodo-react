import { Box, Text, Group, Avatar, TypographyStylesProvider } from '@mantine/core';
import { IconArrowBigUp, IconArrowBigDown } from '@tabler/icons-react';
import { Link } from "react-router-dom";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Comment({ data }) {
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
                    <IconArrowBigUp stroke={1.25} />
                    <span>{data.upvotes.length - data.downvotes.length}</span>
                    <IconArrowBigDown stroke={1.25} />
                </div>
            </Group>
        </Box>
    )
}