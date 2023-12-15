import { useState, useEffect } from 'react';
import { AspectRatio, Card, Group, Image, Text } from '@mantine/core';
import { ProfileHover } from "../templates/profile";
import { Link } from "react-router-dom";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Post({ post }) {
    const [user, setUser] = useState([])
    const url = "/" + user.username + "/" + post._id;

    useEffect(() => {
        fetch("http://localhost:3000/user?id=" + post.author)
            .then(result => result.json())
            .then(user => setUser(user))
    }, [])

    return (
        <Card key={post._id} padding="lg" radius="md" mb={5} withBorder>
            <Card.Section>
                <Link to={url}>
                    <AspectRatio ratio={10 / 4}>
                        <Image src={post.image + "?w=600"} />
                    </AspectRatio>
                </Link>
            </Card.Section>
            
            <Group mt="md" mb="sm" gap="sm">
                <ProfileHover user={user} />
            </Group>

            <Link to={url}>
                <Text
                    c="black"
                    fw={700}
                    fz={24}
                    underline="never"
                    mb="sm"
                    style={{ lineHeight: 1.2 }}
                    lineClamp={2}
                >
                    {post.title}
                </Text>
            </Link>

            <Group>
                <Text size="sm" c="grey">
                    {moment(post.createdAt).fromNow()} &middot; 13 min read &middot; Biology
                </Text>
            </Group>
        </Card>
    )
}