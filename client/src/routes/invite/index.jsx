import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { notifications } from "@mantine/notifications";

export default function Invite() {
    const { privateKey } = useParams();
    const navigate = useNavigate();

    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const handleInvite = async () => {
        const response = await axios.get(`/api/group/invite/${privateKey}`, { headers })
        navigate(`/skupiny/${response.data}`, { replace: true })
        notifications.show({
            title: "Úspešne pridaný do skupiny",
        })
    }

    useEffect(() => {
        handleInvite()
    }, [])
}