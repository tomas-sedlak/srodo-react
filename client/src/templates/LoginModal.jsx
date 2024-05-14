import { useState } from "react";
import { RegisterInput } from "./FloatingInput";
import { Button, Divider, Group, Modal, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useMediaQuery } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import { setLogin, setLoginModal } from "state";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const initialValues = {
    username: "",
    email: "",
    password: "",
    usernameOrEmail: "",
    loginPassword: "",
}

export default function LoginModal() {
    const [pageType, setPageType] = useState("login");
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [globalError, setGlobalError] = useState(null);
    const [statuses, setStatuses] = useState(initialValues);
    const [loading, setLoading] = useState(false);
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const isMobile = useMediaQuery("(max-width: 768px)");
    const opened = useSelector(state => state.loginModal);
    const dispatch = useDispatch();

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

            dispatch(setLoginModal(false));
        } catch (err) {
            setGlobalError("Nastala chyba. Skúste to znova")
        }

        setLoading(false)
    }

    const googleLogin = useGoogleLogin({ onSuccess: handleGoogleLogin });

    const registerInputs = [
        {
            type: "text",
            name: "username",
            label: "Používateľské meno",
            validate: async (event) => {
                const name = event.target.name
                const value = event.target.value

                if (value.length === 0) {
                    setError(name, "Toto pole je povinné")
                    return
                }

                if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    setError(name, 'Môže obsahovať iba písmená, čísla a "_"')
                    return
                }

                setStatus(name, "loading")
                const response = await axios.get(`/api/user/unique?username=${value}`)
                if (!response.data.unique) {
                    setError(name, "Toto používateľské meno už existuje")
                    setStatus(name, null)
                    return
                }

                setError(name, null)
                setStatus(name, null)
            }
        },
        {
            type: "email",
            name: "email",
            label: "Email",
            mt: "sm",
            validate: async (event) => {
                const name = event.target.name
                const value = event.target.value

                if (value.length === 0) {
                    setError(name, "Toto pole je povinné")
                    return
                }

                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(value)) {
                    setError(name, "Neplatný email")
                    setStatus(name, null)
                    return
                }

                setStatus(name, "loading")
                const response = await axios.get(`/api/user/unique?email=${value}`)
                if (!response.data.unique) {
                    setError(name, "Tento email sa už používa")
                    setStatus(name, null)
                    return
                }

                setError(name, null)
                setStatus(name, null)
            }
        },
        {
            type: "password",
            name: "password",
            label: "Heslo",
            mt: "sm",
            validate: (event) => {
                if (event.target.value.length === 0) {
                    setError(event.target.name, "Toto pole je povinné")
                    return
                }

                if (event.target.value.length < 8) {
                    setError(event.target.name, "Heslo musí mať aspoň 8 znakov")
                    return
                }

                setError(event.target.name, null)
            }
        }
    ];

    const loginInputs = [
        {
            type: "text",
            name: "usernameOrEmail",
            label: "Používateľské meno alebo email",
            validate: async (event) => {
                const name = event.target.name
                const value = event.target.value

                if (value.length === 0) {
                    setError(name, "Toto pole je povinné")
                    return
                }

                setError(name, null)
            }
        },
        {
            type: "password",
            name: "loginPassword",
            label: "Heslo",
            mt: "sm",
            validate: async (event) => {
                const name = event.target.name
                const value = event.target.value

                if (value.length === 0) {
                    setError(name, "Toto pole je povinné")
                    return
                }

                setError(name, null)
            }
        }
    ];

    const resetInputs = () => {
        setValues(initialValues)
        setErrors(initialValues)
        setGlobalError(null)
    }

    const isValid = () => {
        return Object.values(errors).every(error => error === null || error === "")
    }

    const setValue = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const setError = (name, error) => {
        setErrors(({ ...errors, [name]: error }))
    }

    const setStatus = (name, status) => {
        setStatuses(({ ...statuses, [name]: status }))
    }

    const register = async () => {
        setLoading(true)

        try {
            await axios.post(
                "/api/auth/register",
                values,
            )

            setPageType("login");
            resetInputs()
        } catch (err) {
            setGlobalError("Nastala chyba. Skontroluj svoje údaje")
        }

        setLoading(false)
    };

    const login = async () => {
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

            dispatch(setLoginModal(false));
            resetInputs()
        } catch (err) {
            setGlobalError("Nesprávne prihlasovacie údaje")
        }

        setLoading(false)
    };

    const handleFormSubmit = async event => {
        event.preventDefault()

        if (!isValid()) return

        if (isLogin) await login();
        if (isRegister) await register();
    };

    return (
        <Modal
            opened={opened}
            onClose={() => {
                dispatch(setLoginModal(false))
                resetInputs()
                setPageType("login")

            }}
            padding={isMobile ? "sm" : "lg"}
            size="sm"
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
            title={<Text fw={700} fz="lg">{isLogin ? "Prihlásiť sa na Šrodo" : "Registrovať sa na Šrodo"}</Text>}
        >
            <form onSubmit={handleFormSubmit}>
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

                {isRegister ? (
                    <>
                        {registerInputs.map((input) =>
                            <RegisterInput
                                value={values[input.name]}
                                setValue={setValue}
                                error={errors[input.name]}
                                status={statuses[input.name]}
                                {...input}
                            />
                        )}
                    </>
                ) : (
                    <>
                        {loginInputs.map((input) =>
                            <RegisterInput
                                value={values[input.name]}
                                setValue={setValue}
                                error={errors[input.name]}
                                status={statuses[input.name]}
                                {...input}
                            />
                        )}

                        <Text
                            mt={4}
                            ta="right"
                            size="sm"
                            c="dimmed"
                            className="pointer"
                        >
                            Zabudnuté heslo?
                        </Text>
                    </>
                )}

                <Button
                    fullWidth
                    mt="lg"
                    type="submit"
                    loading={loading}
                >
                    {isLogin ? "Prihlásiť sa" : "Zaregistrovať sa"}
                </Button>

                <Divider label="alebo" my="md" />

                <Button
                    variant="default"
                    // component="a"
                    leftSection={<img src="/images/logos/google.svg" width={24} height={24} />}
                    // href="/api/auth/google"
                    onClick={googleLogin}
                    fullWidth
                >
                    {isLogin ? "Prihlásiť sa" : "Zaregistrovať sa"} cez Google
                </Button>


                <Text
                    mt="xl"
                    ta="center"
                    c="dimmed"
                    size="sm"
                >
                    {isLogin ? "Nemáte účet?" : "Už máte účet?"}
                    <Text
                        span
                        ml={4}
                        c="srobarka"
                        fw={600}
                        className="pointer"
                        onClick={() => {
                            setPageType(isLogin ? "register" : "login")
                            resetInputs()
                        }}
                    >
                        {isLogin ? "Zaregistrovať sa" : "Prihlásiť sa"}
                    </Text>
                </Text>
            </form>
        </Modal>
    );
}