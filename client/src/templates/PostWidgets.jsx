import { useState } from "react";
import { ActionIcon, Group, Menu, Text, Button, Modal, Radio, RadioGroup, Box } from "@mantine/core";
import { IconDots, IconFlag, IconHeart, IconHeartFilled, IconMessageCircle, IconPencil, IconShare, IconTrash } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import { notifications } from "@mantine/notifications";
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

            <div
                className="icon-wrapper"
                onClick={event => {
                    event.preventDefault()
                    navigator.clipboard.writeText(`https://srodo.sk/${post.author.username}/prispevok/${post._id}`)
                    notifications.show({
                        title: "Skopírované do schránky"
                    })
                }}
            >
                <IconShare stroke={1.25} />
                <span>Zdieľať</span>
            </div>
        </Group>
    )
}

export function PostMenu(props) {
    const { post, type = "post" } = props;
    const queryClient = useQueryClient();
    const userId = useSelector(state => state.user?._id);
    const token = useSelector(state => state.token);
    const navigate = useNavigate();

    const [reportModalOpened, setReportModalOpened] = useState(false);
    const [reportReason, setReportReason] = useState('');

    // const reasons = [
    //     "Spam",
    //     "Hate Speech",
    //     "Harassment",
    //     "Misinformation",
    //     "Other"
    // ];

    const reasons = [
        "Sexuálny obsah",
        "Násilný alebo odpudivý obsah",
        "Nenávistný alebo urážlivý obsah",
        "Obťažovanie alebo šikanovanie",
        "Nebezpečné alebo škodlivé činnosti",
        "Nepravdivé informácie",
        "Zneužívanie detí",
        "Propagácia terorizmu",
        "Spam alebo zavádzajúci obsah",
        "Právna záležitosť",
    ];

    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const deletePost = async () => {
        await axios.delete(`/api/${type}/${post._id}`, { headers });
        await queryClient.invalidateQueries(type + "s");
        notifications.show({
            title: `${type === "post" ? "Príspevok" : "Komentár"} bol zmazaný`,
        })
    }

    const handleReport = async () => {
        if (reportReason.trim() === '') return;

        await axios.post(`/api/report/${post._id}`, { reason: reportReason }, { headers });
        setReportModalOpened(false);
        setReportReason('');
    }

    return (
        <>
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
                        <Menu.Item
                            leftSection={<IconFlag stroke={1.25} />}
                            onClick={() => setReportModalOpened(true)}
                        >
                            <Text>Nahlásiť</Text>
                        </Menu.Item>
                    )}
                </Menu.Dropdown>
            </Menu>

            <Modal
                opened={reportModalOpened}
                onClose={() => setReportModalOpened(false)}
                title="Nahlásiť príspevok"
                centered
            >
                <Radio.Group
                    value={reportReason}
                    onChange={setReportReason}
                >
                    {reasons.map((reason) => (

                        <Radio key={reason} value={reason} label={reason} p="sm" />
                        
                    ))}
                </Radio.Group>
                <Group position="right" mt="md">
                    <Button variant="outline" onClick={() => setReportModalOpened(false)}>
                        Zrušiť
                    </Button>
                    <Button color="red" onClick={handleReport}>
                        Nahlásiť
                    </Button>
                </Group>
            </Modal>
        </>
    )
}
