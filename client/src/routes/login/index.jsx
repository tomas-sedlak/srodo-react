import { useNavigate } from "react-router-dom";
import { RegisterInput } from "templates/FloatingInput";
import { Box, Button, Divider, Group, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import { useState } from "react";
import axios from "axios";

const initialValues = {
    usernameOrEmail: "",
    loginPassword: "",
}

export default function Login() {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState(initialValues);
    const [globalError, setGlobalError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const isValid = () => {
        return Object.values(errors).every(error => error === null || error === "")
    }

    const setValue = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const setError = (name, error) => {
        setErrors(({ ...errors, [name]: error }))
    }

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

            navigate("/")
        } catch (err) {
            setGlobalError("Nesprávne prihlasovacie údaje")
        }

        setLoading(false)
    };

    const handleFormSubmit = async event => {
        event.preventDefault()

        if (!isValid()) return
        await login();
    };

    return (
        <Box className="form-center-wrapper">
            <form onSubmit={handleFormSubmit} className="form-center-inner">
                <Text fw={700} size="xl" mb="lg">Prihlásiť sa na Šrodo</Text>

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

                {loginInputs.map((input) =>
                    <RegisterInput
                        value={values[input.name]}
                        setValue={setValue}
                        error={errors[input.name]}
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
                    component="a"
                    leftSection={<img src="/images/logos/google.svg" width={24} height={24} />}
                    href="/api/auth/google"
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
                        component="a"
                        c="srobarka"
                        fw={600}
                        className="pointer"
                        href="/registracia"
                    >
                        Zaregistrovať sa
                    </Text>
                </Text>
            </form>
        </Box>
    );
}