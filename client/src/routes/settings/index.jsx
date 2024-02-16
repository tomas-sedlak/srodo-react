import { Avatar, Box, TextInput, Textarea } from "@mantine/core";
import { useSelector } from "react-redux";

export default function Settings() {
    const user = useSelector(state => state.user);

    return (
        <Box p="sm" className="border-bottom">
            <Avatar size="lg" src={user.profilePicture} />
            <TextInput mt="sm" label="Display name" value={user.displayName} />
            <TextInput mt="sm" label="Použivateľské meno" value={user.username} />
            <Textarea mt="sm" label="Bio"/>
        </Box>
    )
}