import { useState } from "react";
import { Box, Button, Group, Text, PasswordInput } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import axios from "axios";

export default function ResetPasswordConfirm() {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const navigate = useNavigate();

    const verify = () => {
        let error = null
        if (password.length === 0) error = "Toto pole je povinné!"
        else if (password.length < 8) error = "Heslo musí mať aspoň 8 znakov."

        setPasswordError(error)
        return error
    }

    const handleResetPassword = async (event) => {
        event.preventDefault()
        if (verify()) return

        setLoading(true)

        try {
            await axios.post(`/api/auth/reset-password/${token}`, { newPassword: password })

            navigate("/")
            notifications.show({
                title: "Heslo úspešne zmenené."
            })
        } catch (err) {
            setGlobalError(err.response.data)
        }

        setLoading(false)
    }

    return (
        <Box className="form-center-wrapper">
            <form onSubmit={handleResetPassword} className="form-center-inner">
                <Text fw={700} size="xl" mb="lg">Resetovať heslo</Text>

                {globalError &&
                    <Group
                        bg="var(--mantine-color-red-light)"
                        p="sm"
                        mb="lg"
                        gap={8}
                        style={{ borderRadius: 8 }}
                        align="flex-start"
                    >
                        <IconAlertCircle width={20} height={20} color="red" stroke={1.25} />
                        <Text size="sm" style={{ flex: 1 }}>{globalError}</Text>
                    </Group>
                }

                <PasswordInput
                    label="Nové heslo"
                    onChange={(event) => setPassword(event.target.value)}
                    onBlur={verify}
                    value={password}
                    error={passwordError}
                />

                <Button
                    mt="lg"
                    type="submit"
                    loading={loading}
                    fullWidth
                >
                    Zmeniť heslo
                </Button>
            </form>
        </Box>
    )
}