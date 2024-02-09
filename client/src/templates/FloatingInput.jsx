import { TextInput, PasswordInput } from "@mantine/core";
import { useState } from "react";
import "css/floatingLabel.css";

export function FloatingTextInput({ handleChange, handleBlur, label, name, error, focus }) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0 || undefined;

    return (
        <TextInput
            mt={focus ? 0 : "sm"}
            label={label}
            labelProps={{ "data-floating": floating }}
            classNames={{
                root: "root",
                input: "input",
                label: "label",
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                handleBlur(event)
                if (event.currentTarget.value.length > 0) {setFocused(true)}
                else {setFocused(false)}
            }}
            onChange={event => {
                handleChange(event)
                setValue(event.currentTarget.value)
            }}
            name={name}
            error={error}
            data-autofocus={focus}
        />
    )
}

export function FloatingPasswordInput({ handleChange, handleBlur, label, name, error, focus }) {
    const [value, setValue] = useState("");
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0 || undefined;

    return (
        <PasswordInput
            mt={focus ? 0 : "sm"}
            label={label}
            labelProps={{ "data-floating": floating }}
            classNames={{
                root: "root",
                input: "input",
                label: "label",
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                handleBlur(event)
                if (event.currentTarget.value.length > 0) {setFocused(true)}
                else {setFocused(false)}
            }}
            onChange={event => {
                handleChange(event)
                setValue(event.currentTarget.value)
            }}
            name={name}
            error={error}
            data-autofocus={focus}
        />
    )
}