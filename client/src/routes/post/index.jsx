import { useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { AspectRatio, Box, Text, Group, Title, TypographyStylesProvider, Avatar, Loader, Stack, Menu, ActionIcon, Badge } from '@mantine/core';
import { Link } from "react-router-dom";
import { PostButtons } from 'templates/PostWidgets';
import axios from "axios";
import Comments from "templates/Comments";

// Setup Moment.js for Slovak language
import moment from "moment";
import "moment/dist/locale/sk";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IconChartBar, IconDots, IconFlag, IconPencil, IconTrash } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useSelector } from 'react-redux';
moment.locale("sk");

const typeNames = {
    article: "Článok",
    quiz: "Kvíz",
    discussion: "Diskusia",
}

export default function Post() {
    const { postId } = useParams();
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const addView = async () => {
        await axios.patch(`/api/post/${postId}/view`)
    }

    const fetchPost = async () => {
        const post = await axios.get(`/api/post/${postId}`)
        return post.data
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            addView()
        }, 10000)

        return () => clearTimeout(timeoutId)
    }, [])

    const { data, status } = useQuery({
        queryFn: fetchPost,
        queryKey: ["post", postId],
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <Box p="sm" className="border-bottom">
                <Box pos="relative">
                    <Badge fw={600} className="image-item-left">
                        {typeNames[data.postType]}
                    </Badge>

                    <AspectRatio ratio={2 / 1}>
                        <Box className="lazy-image" style={{ backgroundImage: `url(${data.coverImage})` }}></Box>
                    </AspectRatio>
                </Box>

                <Box mt="sm" pos="relative">
                    <Group gap="xs">
                        <Link to={`/${data.author.username}`}>
                            <Avatar src={data.author.profilePicture} />
                        </Link>

                        <Stack gap={4} pr={32} style={{ flex: 1 }}>
                            <Link to={"/" + data.author.username}>
                                <Text fw={700} size="sm" style={{ lineHeight: 1 }}>
                                    {data.author.displayName}
                                </Text>
                            </Link>

                            <Group gap={4}>
                                <Link to={`/predmety/${data.subject.url}`}>
                                    <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                        {data.subject.label}
                                    </Text>
                                </Link>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    &middot;
                                </Text>
                                <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>
                                    {moment(data.createdAt).fromNow()}
                                </Text>
                            </Group>
                        </Stack>
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
                                        onClick={() => navigate(`/${data.author.username}/${data._id}/upravit`)}
                                        leftSection={<IconPencil stroke={1.25} />}
                                    >
                                        <Text>Upraviť</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => navigate(`/statistiky/${data._id}`)}
                                        leftSection={<IconChartBar stroke={1.25} />}
                                    >
                                        <Text>Štatistiky</Text>
                                    </Menu.Item>

                                    <Menu.Divider />

                                    <Menu.Item
                                        color="red"
                                        onClick={() => modals.openConfirmModal({
                                            title: "Zmazať príspevok",
                                            children: <Text>Určite chceš zmazať tento príspevok?</Text>,
                                            centered: true,
                                            labels: { confirm: "Zmazať", cancel: "Zrušiť" },
                                            confirmProps: { color: "red" },
                                            // onConfirm: () => deleteMutation.mutate(),
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
                    </Menu>

                    <Title
                        fw={800}
                        fz={32}
                        mt="sm"
                        style={{ lineHeight: 1.2 }}
                    >
                        {data.title}
                    </Title>

                    <PostButtons post={data} />

                    <TypographyStylesProvider p={0} mt="sm">
                        <div dangerouslySetInnerHTML={{ __html: data.content }} />
                    </TypographyStylesProvider>
                </Box>
            </Box>

            <Comments comments={data.comments} postId={postId} />
        </>
    )
}