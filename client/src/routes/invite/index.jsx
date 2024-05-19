import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { notifications } from "@mantine/notifications";
import Message from "templates/Message";
import axios from "axios";

export default function Invite() {
    const { privateKey } = useParams();
    const [component, setComponent] = useState();
    const navigate = useNavigate();

    const token = useSelector(state => state.token);
    const headers = {
        Authorization: `Bearer ${token}`,
    }

    const handleInvite = async () => {
        try {
            const response = await axios.get(`/api/group/invite/${privateKey}`, { headers })
            navigate(`/skupiny/${response.data}`, { replace: true })
            notifications.show({
                title: "Úspešne pridaný do skupiny",
            })
        } catch (err) {
            setComponent(
                <div className="loader-center">
                    <Message title="Nesprávna URL adresa" content="Máš nesprávny link alebo link už nie je platný." />
                </div>
            )
        }
    }

    useEffect(() => {
        handleInvite()
    }, [])

    return component
}