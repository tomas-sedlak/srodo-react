import { useLoaderData } from "react-router-dom";
import { Text } from '@mantine/core';

export default function Tag() {
    const tag = useLoaderData();

    return (
        <Text>Tag page: {tag}</Text>
    );
}

export function loader({ params }) {
    return params.tag;
}