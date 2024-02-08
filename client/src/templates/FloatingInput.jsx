import { TextInput, PasswordInput } from "@mantine/core";
import { useState } from "react";
import classes from "../css/Floatinglabel.module.css"


export function FloatingTextInput({ handleChange, handleBlur, label, name, error }) {

    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0 || undefined;

    return (
        <TextInput
            mt="sm"
            label={label}
            labelProps={{ 'data-floating': floating }}
            classNames={{
                root: classes.root,
                input: classes.input,
                label: classes.label,
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                if (event.currentTarget.value.length > 0) {setFocused(true)} // I don't know if this is the right way
                else {setFocused(false)}                
                handleBlur(event)
            }}
            onChange={event => {
                handleChange(event)
                setValue(event.currentTarget.value)
            }}
            name={name}
            error={error}
            autoComplete="none" // this is def NOT the right way to do it
        />
    )
}

export function FloatingPasswordInput({ handleChange, handleBlur, label, name, error }) {

    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);
    const floating = focused || value.length > 0 || undefined;
    
    return (
        <PasswordInput
            mt="sm"
            label={label}
            labelProps={{ 'data-floating': floating }}
            classNames={{
                root: classes.root,
                input: classes.input,
                label: classes.label,
            }}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
                if (event.currentTarget.value.length > 0) {setFocused(true)} // I don't know if this is the right way
                else {setFocused(false)}                
                handleBlur(event)
            }}
            onChange={event => {
                handleChange(event)
                setValue(event.currentTarget.value)
            }}
            name={name}
            error={error}
        />
    )

}