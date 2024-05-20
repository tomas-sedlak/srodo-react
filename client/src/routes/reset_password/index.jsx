import { useState } from "react";
import { Box, Button, TextInput, Group, Text } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import axios from "axios";

export default function ResetPassword() {
    const [pageType, setPageType] = useState("form");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(null);

    const verify = () => {
        let error = null
        if (email.length === 0) error = "Toto pole je povinné!"
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(email)) error = "Neplatný email."

        setEmailError(error)
        return error
    }

    const handleResetPassword = async (event) => {
        event.preventDefault()
        if (verify()) return

        setLoading(true)

        try {
            await axios.post("/api/auth/reset-password", { email })

            setPageType("info")
        } catch (err) {
            setGlobalError(err.response.data)
        }

        setLoading(false)
    }

    return (
        <Box className="form-center-wrapper">
            {pageType === "form" &&
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

                    <TextInput
                        label="Email"
                        placeholder="jozkomrkvicka@gmail.com"
                        onChange={(event) => setEmail(event.target.value)}
                        onBlur={verify}
                        value={email}
                        error={emailError}
                    />

                    <Button
                        mt="lg"
                        type="submit"
                        loading={loading}
                        fullWidth
                    >
                        Zaslať email
                    </Button>
                </form>
            }

            {pageType === "info" &&
                <>
                    <IconCircleCheck size={128} stroke={1} color="green" />
                    <Text mt="sm" ta="center" c="dimmed">Email s overovacím linkom bol zaslaný na <Text component="span" fw={600} c="white">{email}</Text></Text>
                </>
            }
        </Box>
    )
}