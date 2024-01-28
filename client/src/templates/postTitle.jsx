import { useState } from 'react';
import { Textarea, Text } from '@mantine/core';


export default function PostTitle() {

    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);
    const maxCharacterLenght = 64;

    return (
        <>
            <Textarea
                autosize
                mt="md"
                w="100%"
                variant="unstyled"
                placeholder="Názov článku"
                // className="title-input"
                styles={{
                    input: {
                        fontSize: "32px",
                        fontWeight: "700"
                    },
                }}
                value={title}
                maxLength={maxCharacterLenght}
                onChange={event => {
                    setTitle(event.target.value)
                    setCount(event.target.value.length)
                }}
                onKeyDown={event => event.key === "Enter" && event.preventDefault()}
            />
            <Text c="gray" size="sm" ta="end">{count}/{maxCharacterLenght}</Text>
        </>
    )
}


