import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { notifications } from "@mantine/notifications";
import Message from "templates/Message";
import axios from "axios";

export default function Verify() {
    const { verifyKey } = useParams();
    const [component, setComponent] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            const response = await axios.get(`/api/auth/verify/${verifyKey}`)

            dispatch(
                setLogin({
                    user: response.data.user,
                    token: response.data.token,
                })
            );

            navigate("/", { replace: true })
            notifications.show({
                title: "Email úspešne overený. Vitaj na Šrodo.sk 👋",
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
        handleVerify()
    }, [])

    return component
}