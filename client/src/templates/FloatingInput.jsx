import { useState } from "react";
import { TextInput, PasswordInput } from "@mantine/core";
import "css/floatingLabel.css";
import axios from "axios";

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
    const [error, setError] = useState(null);
    const [focused, setFocused] = useState(false);
    const floating = focused || props.inputValue.length > 0 || undefined;

    const handleErrors = async (value) => {
        if (value.length === 0) {
            setError("Toto pole je povinné")
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            setError('Môže obsahovať iba písmená, čísla a "_"')
            return
        }

        const response = await axios.get(`/api/user/unique?username=${value}`)
        if (!response.data.unique) {
            setError("Toto používateľské meno už existuje")
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
            onBlur={async (event) => {
                setFocused(false)
                await handleErrors(event.target.value)
            }}
            onChange={event => {
                const value = event.target.value
                if (value.length > 16) return
                props.setInputValue(event)
            }}
            value={props.inputValue}
            error={error}
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