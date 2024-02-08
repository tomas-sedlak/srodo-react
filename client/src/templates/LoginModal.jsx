import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Container, Group, Button, Center, Divider, Flex, Modal } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { GoogleIcon } from "./GoogleIcon";
import { IconBrandFacebook } from "@tabler/icons-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLoginModal } from "state";
import { Formik } from "formik";
import { setLogin } from "state";
import { useState } from "react";
import * as yup from "yup";
import axios from "axios";
import { FloatingTextInput, FloatingPasswordInput } from "./FloatingInput";

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
    const [pageType, setPageType] = useState("register");
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
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
        // title="Prihlasenie"
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

                                <Flex justify="Space-between">
                                    <Anchor href="#" size="sm" c="dimmed" >
                                        Forgot password?
                                    </Anchor>

                                </Flex>
                            </>
                        ) : (
                            <>
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

                                <Flex justify="Space-between">
                                    <Anchor href="#" size="sm" c="dimmed" >
                                        Forgot password?
                                    </Anchor>

                                </Flex>
                            </>
                        )}

                        <Button
                            fullWidth
                            type="submit"
                            mt="md"
                        >
                            {isLogin ? "Sign in" : "Sign up"}
                        </Button>
                        <Divider mt="md" />
                        <Anchor href="#" c="dimmed" size="sm" >
                            Nemáte účet? Zaregistrujte sa
                        </Anchor>

                    </form>
                )}
            </Formik>
        </Modal>
    );
}