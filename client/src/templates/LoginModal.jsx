import { FloatingTextInput, FloatingPasswordInput, RegisterInput } from "./FloatingInput";
import { Button, Modal, Text } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { setLogin } from "state";
import { useState } from "react";
import axios from "axios";

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
    const [statuses, setStatuses] = useState(initialValues);
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const isMobile = useMediaQuery("(max-width: 768px)");
    const opened = useSelector(state => state.loginModal);
    const dispatch = useDispatch();

    const setValue = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const setError = (name, error) => {
        setErrors(({ ...errors, [name]: error }))
    }

    const setStatus = (name, status) => {
        setStatuses(({ ...statuses, [name]: status }))
    }

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
            type: "email",
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


    const register = async () => {
        // const response = await axios.post(
        //     "/api/auth/register",
        //     values,
        // )

        console.log(values)
        setValues(initialValues)

        // if (response.data) {
        //     setPageType("login");
        // }
    };

    const login = async () => {
        const response = await axios.post(
            "/api/auth/login",
            values,
        )

        if (response.data) {
            dispatch(
                setLogin({
                    user: response.data.user,
                    token: response.data.token,
                })
            );
            dispatch(setLoginModal(false));
        }
    };

    const handleFormSubmit = async () => {
        const isValid = Object.values(errors).every(error => error === null || error === "")
        if (!isValid) return

        if (isLogin) await login();
        if (isRegister) await register();
    };

    return (
        <Modal
            opened={opened}
            onClose={() => dispatch(setLoginModal(false))}
            padding={isMobile ? "sm" : "lg"}
            size="sm"
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
            title={<Text fw={700} fz="lg">{isLogin ? "Prihlásenie" : "Registrácia"}</Text>}
        >
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
                onClick={handleFormSubmit}
            >
                {isLogin ? "Prihlásiť sa" : "Zaregistrovať sa"}
            </Button>

            <Text
                mt="lg"
                ta="center"
                c="dimmed"
                size="sm"
            >
                {isLogin ? "Nemáte účet? " : "Už máte účet? "}
                <Text
                    span
                    c="srobarka"
                    fw={600}
                    className="pointer"
                    onClick={() => {
                        setPageType(isLogin ? "register" : "login")
                    }}
                >
                    {isLogin ? "Zaregistrovať sa" : "Prihlásiť sa"}
                </Text>
            </Text>
        </Modal>
    );
}