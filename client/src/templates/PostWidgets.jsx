import { useState } from "react";
import { ActionIcon, Group, Menu, Text } from "@mantine/core"
import { IconChartBar, IconDots, IconFlag, IconHeart, IconHeartFilled, IconMessageCircle, IconPencil, IconShare, IconTrash } from "@tabler/icons-react"
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

    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(userId));

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

    return (
        <Group gap={8} {...props}>
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
        await axios.delete(`/api/post/${post._id}`, {}, { headers });
        queryClient.invalidateQueries("posts");
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
                            <Text>Upraviť</Text>
                        </Menu.Item>
                        <Menu.Item
                            onClick={() => navigate(`/statistiky/${post._id}`)}
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
                                onConfirm: deletePost,
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
    )
}