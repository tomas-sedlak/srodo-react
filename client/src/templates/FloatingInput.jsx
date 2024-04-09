import { useState } from "react";
import { TextInput, PasswordInput, Loader } from "@mantine/core";
import "css/floatingLabel.css";
import axios from "axios";
import { IconEye } from "@tabler/icons-react";

export function FloatingTextInput(props) {
    const [error, setError] = useState(null);
    const [focused, setFocused] = useState(false);
    const floating = focused || props.inputValue.length > 0 || undefined;

    const handleErrors = (value) => {
        if (value.length === 0) {
            setError("Toto pole je povinné")
            return
        }

        setError(null)
    }

    return (
        <TextInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                setFocused(false)
                handleErrors(event)
            }}
            onChange={event => props.setInputValue(event.currentTarget.value)}
            value={props.inputValue}
            error={error}
            {...props}
        />
    )
}

export function FloatingPasswordInput(props) {
    const [error, setError] = useState(null);
    const [focused, setFocused] = useState(false);
    const floating = focused || props.inputValue.length > 0 || undefined;

    const handleErrors = (value) => {
        if (value.length === 0) {
            setError("Toto pole je povinné")
            return
        }

        setError(null)
    }

    return (
        <PasswordInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                setFocused(false)
                handleErrors(event.target.value)
            }}
            onChange={event => props.setInputValue(event)}
            value={props.inputValue}
            error={error}
            {...props}
        />
    )
}

export function RegisterUsernameInput(props) {
    const [focused, setFocused] = useState(false);
    const floating = focused || props.inputValue.length > 0 || undefined;

    const handleErrors = async (event) => {
        if (event.target.value.length === 0) {
            props.setError(event.target.name, "Toto pole je povinné")
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(event.target.value)) {
            props.setError(event.target.name, 'Môže obsahovať iba písmená, čísla a "_"')
            return
        }

        const response = await axios.get(`/api/user/unique?username=${event.target.value}`)
        if (!response.data.unique) {
            props.setError(event.target.name, "Toto používateľské meno už existuje")
            return
        }

        props.setError(event.target.name, null)
    }

    return (
        <TextInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${props.error && "error"}`,
            }}
            onFocus={() => setFocused(true)}
            onBlur={async (event) => {
                setFocused(false)
                await handleErrors(event)
            }}
            onChange={event => {
                const value = event.target.value
                if (value.length > 16) return
                props.setInputValue(event.target.name, event.target.value)
            }}
            value={props.inputValue}
            {...props}
        />
    )
}

export function RegisterEmailInput(props) {
    const [error, setError] = useState(null);
    const [focused, setFocused] = useState(false);
    const floating = focused || props.inputValue.length > 0 || undefined;

    const handleErrors = async (value) => {
        if (value.length === 0) {
            setError("Toto pole je povinné")
            return
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(value)) {
            setError("Neplatný email")
            return
        }

        const response = await axios.get(`/api/user/unique?email=${value}`)
        if (!response.data.unique) {
            setError("Tento email sa už používa")
            return
        }

        setError(null)
    }

    return (
        <TextInput
            type="email"
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => setFocused(true)}
            onBlur={async (event) => {
                setFocused(false)
                await handleErrors(event.target.value)
            }}
            onChange={event => {
                const value = event.target.value
                if (value.length > 320) return
                props.setInputValue(event)
            }}
            value={props.inputValue}
            error={error}
            {...props}
        />
    )
}

export function RegisterPasswordInput(props) {
    const [error, setError] = useState(null);
    const [focused, setFocused] = useState(false);
    const floating = focused || props.inputValue.length > 0 || undefined;

    const handleErrors = (value) => {
        if (value.length === 0) {
            setError("Toto pole je povinné")
            return
        }

        if (value.length < 8) {
            setError("Heslo musí mať aspoň 8 znakov")
            return
        }

        setError(null)
    }

    return (
        <PasswordInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                setFocused(false)
                handleErrors(event.target.value)
            }}
            onChange={event => {
                props.setInputValue(event)
            }}
            value={props.inputValue}
            error={error}
            {...props}
        />
    )
}


export function RegisterInput(props) {
    const { type, validate, setValue, error, status } = props;
    const [focused, setFocused] = useState(false);
    const floating = focused || props.value.length > 0 || undefined;

    return (
        <TextInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => setFocused(true)}
            onBlur={async (event) => {
                setFocused(false)
                await validate(event)
            }}
            onChange={setValue}
            rightSection={type === "password" ?
                <IconEye />
            : status === "loading" && <Loader size={20} />}
            {...props}
        />
    )
}