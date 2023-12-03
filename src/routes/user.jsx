import { useLoaderData } from "react-router-dom";
import { Text } from '@mantine/core';

export default function User() {
    const username = useLoaderData();

    return (
        <Text>User page: {username}</Text>
    );
}

export function loader({ params }) {
    return params.username;
}