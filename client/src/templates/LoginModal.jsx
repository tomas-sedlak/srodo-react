import { FloatingTextInput, FloatingPasswordInput, RegisterUsernameInput, RegisterEmailInput, RegisterPasswordInput } from "./FloatingInput";
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
}

export default function LoginModal() {
    const [pageType, setPageType] = useState("login");
    const [values, setValues] = useState(initialValues);
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const isMobile = useMediaQuery("(max-width: 768px)");
    const opened = useSelector(state => state.loginModal);
    const dispatch = useDispatch();

    const setValue = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

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

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await axios.post(
            "/api/auth/login",
            values,
        )
        const loggedIn = loggedInResponse.data;
        onSubmitProps.resetForm();
        if (loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user,
                    token: loggedIn.token,
                })
            );
            dispatch(setLoginModal(false));
        }
    };

    const handleFormSubmit = async () => {
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
                    <RegisterUsernameInput
                        label="Používateľské meno"
                        name="username"
                        inputValue={values.username}
                        setInputValue={setValue}
                        required
                    />

                    <RegisterEmailInput
                        mt="sm"
                        label="Email"
                        name="email"
                        inputValue={values.email}
                        setInputValue={setValue}
                        required
                    />

                    <RegisterPasswordInput
                        mt="sm"
                        label="Heslo"
                        name="password"
                        inputValue={values.password}
                        setInputValue={setValue}
                        required
                    />
                </>
            ) : (
                <>
                    <FloatingTextInput
                        label="Email alebo používateľské meno"
                        name="email"
                        inputValue={values.email}
                        setInputValue={setValue}
                        required
                    />

                    <FloatingPasswordInput
                        mt="sm"
                        label="Heslo"
                        name="password"
                        inputValue={values.password}
                        setInputValue={setValue}
                        required
                    />

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
                onClick={handleFormSubmit}
                fullWidth
                mt="lg"
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