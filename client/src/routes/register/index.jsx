import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterInput } from "templates/FloatingInput";
import { Box, Button, Divider, Group, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { notifications } from "@mantine/notifications";
import axios from "axios";

const initialValues = {
    username: "",
    email: "",
    password: "",
}

export default function Register() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [globalError, setGlobalError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inputs = [
        {
            type: "text",
            name: "username",
            label: "Používateľské meno",
            validate: (value) => {
                let error = null
                if (value.length === 0) {
                    error = "Toto pole je povinné"
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    error = 'Môže obsahovať iba písmená, čísla a "_"'
                }

                setError("username", error)
            }
        },
        {
            type: "email",
            name: "email",
            label: "Email",
            mt: "sm",
            validate: (value) => {
                let error = null
                if (value.length === 0) {
                    error = "Toto pole je povinné"
                } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(value)) {
                    error = "Neplatný email"
                }

                setError("email", error)
            }
        },
        {
            type: "password",
            name: "password",
            label: "Heslo",
            mt: "sm",
            validate: (value) => {
                let error = null
                if (value.length === 0) {
                    error = "Toto pole je povinné"
                } else if (value.length < 8) {
                    error = "Heslo musí mať aspoň 8 znakov"
                }

                setError("password", error)
            }
        }
    ];

    const setValue = (event) => {
        setValues(prevValues => ({ ...prevValues, [event.target.name]: event.target.value }))
    }

    const setError = (name, error) => {
        setErrors(prevErrors => ({ ...prevErrors, [name]: error }))
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        for (const input of inputs) {
            input.validate(values[input.name])
        }
        if (!Object.values(errors).every(error => error === null)) return

        setLoading(true)

        try {
            await axios.post(
                "/api/auth/register",
                values,
            )

            dispatch(setLoginModal(false))
            navigate("/kontorla-emailu")
        } catch (err) {
            setGlobalError(err.response.data)
        }

        setLoading(false)
    };

    const handleGoogleLogin = async (tokenResponse) => {
        setLoading(true)

        try {
            const accessToken = tokenResponse.access_token
            const response = await axios.post("/api/auth/google", { accessToken })

            dispatch(
                setLogin({
                    user: response.data.user,
                    token: response.data.token,
                })
            );

            dispatch(setLoginModal(false))
            navigate("/")
            notifications.show({
                title: "Úspešne prihlásený."
            })
        } catch (err) {
            setGlobalError(err.response.data)
        }

        setLoading(false)
    }

    const googleLogin = useGoogleLogin({ onSuccess: handleGoogleLogin });

    return (
        <Box className="form-center-wrapper">
            <form onSubmit={handleLogin} className="form-center-inner">
                <Text fw={700} size="xl" mb="lg">Registrovať sa na Šrodo</Text>

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

                {inputs.map((input) =>
                    <RegisterInput
                        value={values[input.name]}
                        setValue={setValue}
                        error={errors[input.name]}
                        {...input}
                    />
                )}

                <Button
                    fullWidth
                    mt="lg"
                    type="submit"
                    loading={loading}
                >
                    Zaregistrovať sa
                </Button>

                <Divider label="alebo" my="md" />

                <Button
                    variant="default"
                    leftSection={<img src="/images/logos/google.svg" width={24} height={24} />}
                    onClick={googleLogin}
                    fullWidth
                >
                    Zaregistrovať sa cez Google
                </Button>

                <Text
                    mt="xl"
                    ta="center"
                    c="dimmed"
                    size="sm"
                >
                    Už máte účet?
                    <Text
                        ml={4}
                        component="span"
                        c="srobarka"
                        fw={600}
                        className="pointer"
                        onClick={() => {
                            dispatch(setLoginModal(false))
                            navigate("/prihlasenie")
                        }}
                    >
                        Prihlásiť sa
                    </Text>
                </Text>
            </form>
        </Box>
    );
}