import { Avatar, Box, Group, Text } from '@mantine/core'

export default function MembersDisplay({ members, ...props }) {
    const getSlovakWord = (length) => {
        switch (length) {
            case 1: return "Člen"
            case 2: return "Členovia"
            case 3: return "Členovia"
            case 4: return "Členovia"
            default: return "Členov"
        }
    }

    return (
        <Group align="center" gap={8} wrap="nowrap" {...props}>
            <Box className="members-preview">
                {members.slice(-5).map(member =>
                    <Avatar
                        size={32}
                        key={member._id}
                        className="no-image"
                        src={member.profilePicture?.thumbnail}
                        style={{ outline: "var(--mantine-color-body) solid 2px" }}
                    />
                )}
            </Box>
            <Text span c="dimmed"><Text span fw={700} c="var(--mantine-color-text)">{members.length}</Text> {getSlovakWord(members.length)}</Text>
        </Group>
    )
}
