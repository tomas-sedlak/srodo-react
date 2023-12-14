import { useState, useEffect } from 'react';
import { useLoaderData, Link } from "react-router-dom";
import { Box, Card, AspectRatio, Image, Text, Group, Title, NumberFormatter, Button } from '@mantine/core';
import Profile from "../templates/profile";
import News from "../templates/aside";
import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Article() {
    const [username, article] = useLoaderData();
    const [user, setUser] = useState([])
    const [post, setPost] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/post/" + article)
            .then(result => result.json())
            .then(post => {
                setPost(post)
            })

        fetch("http://localhost:3000/username/" + username)
            .then(result => result.json())
            .then(user => {
                setUser(user)
            })
    }, [])

    return (
                    <Card padding="lg" radius="md" mb="md" withBorder>
                        <Card.Section>
                            <AspectRatio ratio={10 / 4}>
                                <Image src={post.image} />
                            </AspectRatio>
                        </Card.Section>
                        
                        <Group mt="lg" mb="sm" gap="xs">
                            <Profile user={user} />
                        </Group>

                        <Title
                            fw={800}
                            fz={32}
                            mb="sm"
                            style={{ lineHeight: 1.2 }}
                        >
                            {post.title}
                        </Title>

                        {/* <Box mb="lg">
                            <Tags tags={post.tags} />
                        </Box> */}

                        <Text c="gray" size="sm" mb="lg">
                            {"Vytvorené " + moment(post.createdAt).fromNow()} &middot;
                            {/* {post.createdAt != post.updatedAt && "Upravené " + moment(post.updatedAt).fromNow()} &middot; */}
                            13 min read &middot;
                            Biology
                        </Text>

                        <Text mb="md">{post.content}</Text>

                    </Card>
        //         </Box>
        //         <Box w={340}>
        //             <Card padding="md" radius="md" mb="md" withBorder>
        //                 <Profile user={user} size="lg" />

        //                 <Text mt="md">
        //                     {user.description ? user.description : "No user description"}
        //                 </Text>

        //                 <Group mt="md" gap="xl">
        //                     <Text>
        //                         <b><NumberFormatter value={user.posts} thousandSeparator /></b> Posts
        //                     </Text>
        //                     <Text>
        //                         <b><NumberFormatter value={user.likes} thousandSeparator /></b> Likes
        //                     </Text>
        //                 </Group>

        //                 <Button mt="md">
        //                     Follow
        //                 </Button>
        //             </Card>

        //             <News />
        //         </Box>
        //     </Group>
        // </Box>
    )
}

export function loader({ params }) {
    return [params.username, params.article];
}