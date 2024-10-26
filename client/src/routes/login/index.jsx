import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Divider, Group, Text } from "@mantine/core";
import { RegisterInput } from "templates/FloatingInput";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { setLogin, setLoginModal } from "state";
import { useGoogleLogin } from "@react-oauth/google";
import { notifications } from "@mantine/notifications";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Link } from "react-router-dom";

const initialValues = {
    usernameOrEmail: "",
    password: "",
}

export default function Login({ modal }) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [globalError, setGlobalError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inputs = [
        {
            type: "text",
            name: "usernameOrEmail",
            label: "Používateľské meno alebo email",
            validate: (value) => {
                let error = null
                if (value.length === 0) error = "Toto pole je povinné"

                setError("usernameOrEmail", error)
            }
        },
        {
            type: "password",
            name: "password",
            label: "Heslo",
            mt: "sm",
            validate: (value) => {
                let error = null
                if (value.length === 0) error = "Toto pole je povinné"

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
            const response = await axios.post(
                "/api/auth/login",
                values,
            )

            dispatch(
                setLogin({
                    user: response.data.user,
                    token: response.data.token,
                })
            );

            dispatch(setLoginModal(false))
            navigate("/")
            notifications.show({
                title: "Úspešne prihlásený. Vitaj späť 👋"
            })
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
                title: "Úspešne prihlásený. Vitaj na späť 👋"
            })
        } catch (err) {
            setGlobalError(err.response.data)
        }

        setLoading(false)
    }

    const googleLogin = useGoogleLogin({ onSuccess: handleGoogleLogin });

    return (
        <>
            <Helmet>
                <title>Prihlásenie / Šrodo</title>
                <meta name="description" content="Vitaj späť na Šrodo. Prihlás sa aby si mohol zdieľať svoje vedomosti a zapájať sa do diskusií." />
            </Helmet>

            <Box className={!modal && "form-center-wrapper"}>
                <form onSubmit={handleLogin} className={!modal && "form-center-inner"}>
                    {!modal &&
                        <>
                            <Text fw={700} size="xl">Vitaj späť 👋</Text>
                            <Text c="dimmed" mb="lg">Prihlás sa na Šrodo</Text>
                        </>
                    }

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

                    <Group mt={4} justify="flex-end">
                        <Text
                            size="sm"
                            c="dimmed"
                            className="pointer"
                            onClick={() => {
                                dispatch(setLoginModal(false))
                                navigate("/resetovat-heslo")
                            }}
                        >
                            Zabudnuté heslo?
                        </Text>
                    </Group>

                    <Button
                        fullWidth
                        mt="lg"
                        type="submit"
                        loading={loading}
                    >
                        Prihlásiť sa
                    </Button>

                    <Divider label="alebo" my="md" />

                    <Button
                        variant="default"
                        leftSection={<img src="/images/logos/google.svg" width={24} height={24} />}
                        onClick={googleLogin}
                        fullWidth
                    >
                        Prihlásiť sa cez Google
                    </Button>

                    <Text
                        mt="xl"
                        ta="center"
                        c="dimmed"
                        size="sm"
                    >
                        Nemáte účet?
                        <Text
                            ml={4}
                            component="span"
                            c="srobarka"
                            fw={600}
                            className="pointer"
                            onClick={() => {
                                dispatch(setLoginModal(false))
                                navigate("/registracia")
                            }}
                        >
                            Zaregistrovať sa
                        </Text>
                    </Text>
                </form>
            </Box>
        </>
    );
}