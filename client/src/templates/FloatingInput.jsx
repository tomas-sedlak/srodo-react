import { TextInput, PasswordInput } from "@mantine/core";
import { useState } from "react";
import "css/floatingLabel.css";

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