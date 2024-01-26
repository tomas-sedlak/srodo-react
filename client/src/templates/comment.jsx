import { Box, Text, Group, Avatar, TypographyStylesProvider } from '@mantine/core';
import { Link } from "react-router-dom";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Comment({ data }) {
    // const [liked, setLiked] = useState(false);

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

            <TypographyStylesProvider p={0} ml={46}>
                <div className="user-text" dangerouslySetInnerHTML={{ __html: data.content }} />
            </TypographyStylesProvider>

            {/* <Group gap={8}>
                    <div
                        className={`icon-wrapper ${liked ? "like-selected" : "like"}`}
                        onClick={(event) => { event.preventDefault(); setLiked(!liked) }}
                    >
                        {liked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                        <span>{liked ? 5 + 1 : 5}</span>
                    </div>

                    <div className={`icon-wrapper`}>
                        <IconMessageCircle stroke={1.25} />
                        <span>Odpovedať</span>
                    </div>
                </Group> */}
        </Box>
    )
}