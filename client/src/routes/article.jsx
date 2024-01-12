import { useState, useEffect } from 'react';
import { useLoaderData } from "react-router-dom";
import { AspectRatio, Box, Image, Text, Group, Title, TypographyStylesProvider, Avatar, TextInput, ActionIcon, Flex, Paper, UnstyledButton, Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowRight } from '@tabler/icons-react';
import { Link } from "react-router-dom";

import moment from "moment";
import "moment/dist/locale/sk";
moment.locale("sk");

export default function Article() {
    const [username, article] = useLoaderData();
    const [user, setUser] = useState([])
    const [post, setPost] = useState([])

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + "/content/article?id=" + article)
            .then(result => result.json())
            .then(data => setPost(data))

        fetch(import.meta.env.VITE_API_URL + "/user?username=" + username)
            .then(result => result.json())
            .then(data => setUser(data))
    }, [])

    const [openned, { toggle }] = useDisclosure(false)

    return (
        <>
            <Box p="sm">
                <AspectRatio ratio={10 / 4}>
                    <Image radius="lg" src={post.image + "?w=600"} />
                </AspectRatio>

                <Group gap={4} align="center" mt="sm">
                    <Avatar />

                    <Link to="username">
                        <Text fw={600} c="gray" size="sm">
                            Display name
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; Článok &middot; {moment(post.createdAt).fromNow()}
                    </Text>
                </Group>

                <Title
                    fw={800}
                    fz={32}
                    mt="sm"
                    style={{ lineHeight: 1.2 }}
                >
                    {post.title}
                </Title>

                <TypographyStylesProvider p={0} mt="sm">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </TypographyStylesProvider>
            </Box>

            {/* TODO: add comment section */}

            <Box p="sm">

                {/* Adding new comments */}

                <Flex w="100%" gap="sm" pb="sm">
                    <Avatar />
                    <TextInput w="100%" placeholder="Tu mi napíš niečo pekné" radius="lg" rightSection={
                        <ActionIcon radius="lg" variant="default">
                            <IconArrowRight stroke={1.25} />
                        </ActionIcon>
                    } 
                    />
                </Flex>

                {/* Comment head section, displayname etc. */}

                <Group gap={4} align="center" mt="sm" >
                    <Avatar size="sm" />

                    <Link to="username">
                        <Text fw={600} c="gray" size="sm">
                            Display name
                        </Text>
                    </Link>
                    <Text c="gray" size="sm">
                        &middot; pred 13 min
                    </Text>
                </Group>

                {/* The comment itself and the answer button */}

                    <Text size="sm" className="Comment" p="sm">Awesome comment</Text> {/* This is NOT how the border should look, it NEEDS a BETTER solution */}
                    <UnstyledButton className="Text-button" c="gray" ml="sm" onClick={toggle}>Odpovedať</UnstyledButton>

                {/* Answers to comments */}

                <Collapse in={openned} pt="sm" ml="md">

                    <Flex w="100%" gap="sm" pb="sm">
                        <Avatar />
                        <TextInput w="100%" placeholder="Tu mi napíš niečo pekné" radius="lg" rightSection={
                            <ActionIcon radius="lg" variant="default">
                                <IconArrowRight stroke={1.25} />
                            </ActionIcon>
                            // I think it looks good with the icon but it might be changed later
                        } 
                        />
                    </Flex>

                    <Group gap={4} align="center" mt="sm">
                        <Avatar size="sm" />

                        <Link to="username">
                            <Text fw={600} c="gray" size="sm">
                                Display name
                            </Text>
                        </Link>
                        <Text c="gray" size="sm">
                            &middot; pred 13 min
                        </Text>
                    </Group>
                    <Text size="sm" className="Comment" p="sm">No, it's not awesome. It should be Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptatem ab optio, atque fuga iure doloremque quasi impedit reprehenderit aut inventore aspernatur! Voluptates quos recusandae obcaecati provident nostrum delectus laboriosam! Ipsam.</Text>
                </Collapse>
            </Box>
        </>
    )
}

export function loader({ params }) {
    return [params.username, params.article];
}