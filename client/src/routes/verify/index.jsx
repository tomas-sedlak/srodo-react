import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from "axios";

export default function Verify() {
    const { verifyKey } = useParams();
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            await axios.get(`/api/auth/verify/${verifyKey}`)
            navigate("/", { replace: true })
            notifications.show({
                title: "Email úspešne overený",
            })
        } catch (err) {
            navigate("/")
        }
    }

    useEffect(() => {
        handleVerify()
    }, [])
}