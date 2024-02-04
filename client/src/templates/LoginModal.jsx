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
            `${import.meta.env.VITE_API_URL}/auth/register`,
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
            `${import.meta.env.VITE_API_URL}/auth/login`,
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
            padding="sm"
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
        >
            <Title align="center" >
                Welcome back!
            </Title>

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
                                <TextInput
                                    label="Uername"
                                    placeholder="username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.username}
                                    name="username"
                                    error={
                                        Boolean(touched.username) && Boolean(errors.username)
                                    }
                                />
                                <TextInput
                                    label="Email"
                                    placeholder="example@gmail.com"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={
                                        Boolean(touched.email) && Boolean(errors.email)
                                    }
                                />
                                <PasswordInput
                                    placeholder="Password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={
                                        Boolean(touched.password) && Boolean(errors.password)
                                    }
                                />
                            </>
                        ) : (
                            <>
                                <TextInput
                                    label="Email"
                                    placeholder="example@gmail.com"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={
                                        Boolean(touched.email) && Boolean(errors.email)
                                    }
                                />
                                <PasswordInput
                                    placeholder="Password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.password}
                                    name="password"
                                    error={
                                        Boolean(touched.password) && Boolean(errors.password)
                                    }
                                />
                            </>
                        )}

                        <Button
                            fullWidth
                            type="submit"
                        >
                            {isLogin ? "Sign in" : "Sign up"}
                        </Button>
                    </form>
                )}
            </Formik>
        </Modal>
    );
}