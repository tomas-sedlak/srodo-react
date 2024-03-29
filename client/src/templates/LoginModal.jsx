import { FloatingTextInput, FloatingPasswordInput } from "./FloatingInput";
import { Button, Modal, Text } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import { Formik } from "formik";
import { setLogin } from "state";
import { useState } from "react";
import * as yup from "yup";
import axios from "axios";


const registerSchema = yup.object().shape({
    username: yup.string().max(64, "Používateľské meno presiahlo minimálnu dĺžku").required("Toto pole je povinné"),
    email: yup.string().email("Neplatný email").required("Toto pole je povinné"),
    password: yup.string().min(8, "Heslo musí mať aspoň 8 znakov").required("Toto pole je povinné"),
})

const initialValuesRegister = {
    username: "",
    email: "",
    password: "",
}

const loginSchema = yup.object().shape({
    email: yup.string().email("Neplatný email").required("Toto pole je povinné"),
    password: yup.string().required("Toto pole je povinné"),
})

const initialValuesLogin = {
    email: "",
    password: "",
}

export default function LoginModal() {
    const [pageType, setPageType] = useState("login");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";

    const isMobile = useMediaQuery("(max-width: 768px)");
    const opened = useSelector(state => state.loginModal);
    const dispatch = useDispatch();

    const register = async (values, onSubmitProps) => {
        const savedUserResponse = await axios.post(
            "/api/auth/register",
            values,
        )

        const savedUser = savedUserResponse.data;
        onSubmitProps.resetForm();

        if (savedUser) {
            setPageType("login");
        }
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

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps);
        if (isRegister) await register(values, onSubmitProps);
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
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
                validationSchema={isLogin ? loginSchema : registerSchema}
            >
                {({
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    resetForm,
                }) => (
                    <form onSubmit={handleSubmit}>
                        {isRegister ? (
                            <>
                                <FloatingTextInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Používateľské meno"
                                    name="username"
                                    error={touched.username && errors.username}
                                    initialFocus
                                />

                                <FloatingTextInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Email"
                                    name="email"
                                    error={touched.email && errors.email}
                                />

                                <FloatingPasswordInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Heslo"
                                    name="password"
                                    error={touched.password && errors.password}
                                />
                            </>
                        ) : (
                            <>
                                <FloatingTextInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Email alebo používateľské meno"
                                    name="email"
                                    error={touched.email && errors.email}
                                    initialFocus
                                />

                                <FloatingPasswordInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Heslo"
                                    name="password"
                                    error={touched.password && errors.password}
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
                            fullWidth
                            type="submit"
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
                                    resetForm()
                                    setPageType(isLogin ? "register" : "login")
                                }}
                            >
                                {isLogin ? "Zaregistrovať sa" : "Prihlásiť sa"}
                            </Text>
                        </Text>
                    </form>
                )}
            </Formik>
        </Modal>
    );
}