import { useEffect, useState } from "react";
import { ActionIcon, Group, Menu, Stack, Text } from "@mantine/core"
import { IconDownload, IconDots, IconFlag, IconHeart, IconHeartFilled, IconMessageCircle, IconPencil, IconShare, IconTrash } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import { modals } from "@mantine/modals";
import axios from "axios";

export function PostButtons(props) {
    const { post } = props;
    const dispatch = useDispatch();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);

    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const likePost = async () => {
        isLiked ? setLikes(likes - 1) : setLikes(likes + 1)
        setIsLiked(!isLiked)
        await axios.patch(
            `/api/post/${post._id}/like`, {}, { headers },
        )
    }

    useEffect(() => {
        setLikes(post.likes.length)
        setIsLiked(post.likes.includes(userId))
    }, [post])

    return (
        <Group gap={4} {...props}>
            <div
                className={`icon-wrapper ${isLiked ? "like-selected" : "like"}`}
                onClick={event => {
                    event.preventDefault()
                    if (userId) likePost()
                    else dispatch(setLoginModal(true))
                }}
            >
                {isLiked ? <IconHeartFilled stroke={1.25} /> : <IconHeart stroke={1.25} />}
                <span>{likes}</span>
            </div>

            <HashLink to={`/${post.author.username}/prispevok/${post._id}#komentare`} className="icon-wrapper">
                <IconMessageCircle stroke={1.25} />
                <span>{post.comments}</span>
            </HashLink>

            <div className="icon-wrapper">
                <IconShare stroke={1.25} />
                <span>Zdieľať</span>
            </div>
        </Group>
    )
}

export function PostMenu(props) {
    const { post } = props;
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const deletePost = async () => {
        await axios.delete(`/api/${props.type}/${post._id}`, { headers });
        queryClient.invalidateQueries(props.type);
    }

    return (
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
                    onClick={event => event.preventDefault()}
                >
                    <IconDots stroke={1.25} style={{ width: 20, height: 20 }} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {post.author._id === userId ? (
                    <>
                        <Menu.Item
                            onClick={() => navigate(`${url}/upravit`)}
                            leftSection={<IconPencil stroke={1.25} />}
                        >
                            <Text fw={600} size="sm">Upraviť</Text>
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                            color="red"
                            onClick={event => {
                                event.preventDefault()
                                modals.openConfirmModal({
                                    title: "Zmazať príspevok",
                                    children: <Text>Určite chceš zmazať tento príspevok?</Text>,
                                    centered: true,
                                    labels: { confirm: "Zmazať", cancel: "Zrušiť" },
                                    confirmProps: { color: "red" },
                                    onConfirm: deletePost,
                                })
                            }}
                            leftSection={<IconTrash stroke={1.25} />}
                        >
                            <Text fw={600} size="sm">Odstrániť</Text>
                        </Menu.Item>
                    </>
                ) : (
                    <Menu.Item leftSection={<IconFlag stroke={1.25} />}>
                        <Text>Nahlásiť</Text>
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}

function getSize(size) {
    let sizes = [" Bytes", " KB", " MB", " GB", " TB", " PB", " EB", " ZB", " YB"];

    for (let i = 1; i < sizes.length; i++) {
        if (size < Math.pow(1024, i)) {
            return (Math.round((size / Math.pow(1024, i - 1)) * 100) / 100) + sizes[i - 1];
        }
    }

    return size;
}

export function DownloadFile({ file }) {
    return (
        <a href={file.file} download={file.name}>
            <Group gap="xs" wrap="nowrap" className="file-download">
                <IconDownload stroke={1.25} />

                <Stack gap={4}>
                    <Text size="sm" fw={600} style={{ lineHeight: 1 }}>{file.name}</Text>
                    <Text size="sm" c="dimmed" style={{ lineHeight: 1 }}>{getSize(file.size)}</Text>
                </Stack>
            </Group>
        </a>
    )
}