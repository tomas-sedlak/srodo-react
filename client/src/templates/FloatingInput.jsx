import { useState } from "react";
import { TextInput, PasswordInput, Loader } from "@mantine/core";
import "css/floatingLabel.css";
import axios from "axios";

export function FloatingTextInput(props) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0 || undefined;

    return (
        <TextInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${props.error && "error"}`,
            }}
            onFocus={() => {
                setFocused(true)
            }}
            onBlur={(event) => {
                props.handleBlur(event)
                setFocused(false)
            }}
            onChange={event => {
                props.handleChange(event)
                setValue(event.currentTarget.value)
            }}
            {...props}
        />
    )
}

export function FloatingPasswordInput(props) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0 || undefined;

    return (
        <PasswordInput
            classNames={{
                root: "input-root",
                label: `input-label ${floating && "floating"} ${focused && "focused"} ${props.error && "error"}`,
            }}
            onFocus={() => {
                setFocused(true)
            }}
            onBlur={(event) => {
                props.handleBlur(event)
                setFocused(false)
            }}
            onChange={event => {
                props.handleChange(event)
                setValue(event.currentTarget.value)
            }}
            {...props}
        />
    )
}

export function UsernameInput(props) {
    const [inputValue, setInputValue] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);
    const [focused, setFocused] = useState(false);
    const floating = focused || inputValue.length > 0 || undefined;

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkUnique = async (value) => {
        setLoading(true)

        const response = await axios.get(`/api/user/unique?username=${value}`)
        if (!response.data.unique) {
            setError("Toto používateľské meno už existuje")
        }

        setLoading(false)
    }

    const handleErrors = (value) => {
        if (value.length === 0) {
            setError("Toto pole je povinné")
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            setError("Môže obsahovať iba písmená, čísla a podčiarkovníky")
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
                handleErrors(event.target.value)
                setFocused(false)
            }}
            onChange={event => {
                const value = event.target.value

                if (value.length > 30) return

                setInputValue(value)
                handleErrors(value)

                clearTimeout(typingTimeout)
                setTypingTimeout(
                    setTimeout(() => {
                        checkUnique(value)
                    }, 600)
                )
            }}
            value={inputValue}
            rightSection={loading && <Loader size={20} />}
            error={error}
            {...props}
        />
    )
}

export function EmailInput(props) {
    const [inputValue, setInputValue] = useState("");
    const [focused, setFocused] = useState(false);
    const floating = focused || inputValue.length > 0 || undefined;
    const [error, setError] = useState(null);

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
                if (value.length > 30) return
                setInputValue(value)
            }}
            value={inputValue}
            error={error}
            {...props}
        />
    )
}