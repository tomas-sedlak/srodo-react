import { useState } from "react";
import { Group } from "@mantine/core"
import { IconEye, IconHeart, IconHeartFilled, IconMessageCircle } from "@tabler/icons-react"
import { useDispatch, useSelector } from "react-redux";
import { setLoginModal } from "state";
import axios from "axios";

export function PostButtons({ post }) {
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
            `/api/post/${post._id}/like`, { userId }, { headers },
        )
    }

    return (
        <Group justify="space-between" mt={8}>
            <Group gap={8}>
                {/* Views */}
                <div className="icon-wrapper">
                    <IconEye stroke={1.25} />
                    <span>{post.views.reduce((acc, view) => acc + view.count, 0)}</span>
                </div>

                {/* Likes button */}
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

                {/* Comments */}
                <div className="icon-wrapper">
                    <IconMessageCircle stroke={1.25} />
                    <span>{post.comments}</span>
                </div>
            </Group>
        </Group>
    )
}