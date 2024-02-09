import { FloatingTextInput, FloatingPasswordInput } from "./FloatingInput";
import { Button, Modal, Text } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginModal } from "state";
import { Formik } from "formik";
import { setLogin } from "state";
import { useState } from "react";
import * as yup from "yup";
import axios from "axios";


const registerSchema = yup.object().shape({
    username: yup.string().max(64).required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
})

const initialValuesRegister = {
    username: "",
    email: "",
    password: "",
}

const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
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
    const navigate = useNavigate();

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
            padding="lg"
            size="sm"
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
            title={<Text fw={600}>{isLogin ? "Prihlásenie" : "Registrácia"}</Text>}
        >
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
                validationSchema={isLogin ? loginSchema : registerSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm,
                }) => (
                    <form onSubmit={handleSubmit}>
                        {isRegister ? (
                            <>
                                <FloatingTextInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Username"
                                    name="username"
                                    error={touched.username && errors.username}
                                    focus
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
                                    label="Password"
                                    name="password"
                                    error={touched.password && errors.password}
                                />
                            </>
                        ) : (
                            <>
                                <FloatingTextInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Email"
                                    name="email"
                                    error={touched.email && errors.email}
                                    focus
                                />

                                <FloatingPasswordInput
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    label="Password"
                                    name="password"
                                    error={touched.password && errors.password}
                                />

                                <Text
                                    mt={4}
                                    ta="right"
                                    size="sm"
                                    c="gray"
                                    className="pointer"
                                >
                                    Zabudnuté heslo?
                                </Text>
                            </>
                        )}

                        <Button
                            fullWidth
                            type="submit"
                            mt="md"
                        >
                            {isLogin ? "Prihlásiť sa" : "Zaregistrovať sa"}
                        </Button>

                        <Text
                            mt="sm"
                            ta="center"
                            c="gray"
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