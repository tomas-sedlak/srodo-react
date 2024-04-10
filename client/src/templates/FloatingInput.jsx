import { useState } from "react";
import { TextInput, PasswordInput, Loader, ActionIcon } from "@mantine/core";
import { IconEye, IconEyeClosed, IconEyeOff } from "@tabler/icons-react";
import "css/floatingLabel.css";

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

export function RegisterInput(props) {
    const { type, validate, setValue, error, status } = props;
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
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
                visible ?
                    <ActionIcon variant="subtle" color="gray" c="dimmed" onClick={() => setVisible(false)}>
                        <IconEyeOff stroke={1.25} />
                    </ActionIcon>
                    : <ActionIcon variant="subtle" color="gray" c="dimmed" onClick={() => setVisible(true)}>
                        <IconEye stroke={1.25} />
                    </ActionIcon>
                : status === "loading" && <Loader size={20} />}
            {...props}
            type={type === "password" && visible ? "text" : "password"}
        />
    )
}