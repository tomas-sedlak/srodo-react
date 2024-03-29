import { TextInput, PasswordInput } from "@mantine/core";
import { useState } from "react";
import "css/floatingLabel.css";

export function FloatingTextInput({ handleChange, handleBlur, label, name, error, initialFocus }) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(initialFocus);
    const floating = focused || value.length > 0 || undefined;

    return (
        <TextInput
            mt={initialFocus ? 0 : "sm"}
            label={label}
            classNames={{
                root: "root",
                label: `label ${floating &&"floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => {
                setFocused(true)
            }}
            onBlur={(event) => {
                handleBlur(event)
                setFocused(false)
            }}
            onChange={event => {
                handleChange(event)
                setValue(event.currentTarget.value)
            }}
            name={name}
            error={error}
            data-autofocus={initialFocus}
        />
    )
}

export function FloatingPasswordInput({ handleChange, handleBlur, label, name, error, initialFocus }) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(initialFocus);
    const floating = focused || value.length > 0 || undefined;

    return (
        <PasswordInput
            mt={initialFocus ? 0 : "sm"}
            label={label}
            classNames={{
                root: "root",
                label: `label ${floating &&"floating"} ${focused && "focused"} ${error && "error"}`,
            }}
            onFocus={() => {
                setFocused(true)
            }}
            onBlur={(event) => {
                handleBlur(event)
                setFocused(false)
            }}
            onChange={event => {
                handleChange(event)
                setValue(event.currentTarget.value)
            }}
            name={name}
            error={error}
            data-autofocus={initialFocus}
        />
    )
}