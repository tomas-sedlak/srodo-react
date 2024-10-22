import { Avatar, Box, Group, Tooltip, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function MembersDisplay({ members }) {
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
        <Group mt="sm" align="center" gap="sm">
            <Box className="members-preview">
                {members.slice(-5).map(member =>
                    <Tooltip label={`@${member.username}`} openDelay={200} withArrow>
                        <Link to={`/${member.username}`} key={member._id}>
                            <Avatar
                                className="no-image"
                                src={member.profilePicture?.thumbnail}
                                style={{ outline: "var(--mantine-color-body) solid 2px" }}
                            />
                        </Link>
                    </Tooltip>
                )}
            </Box>
            <Text span c="dimmed"><Text span fw={700} c="var(--mantine-color-text)">{members.length}</Text> {getSlovakWord(members.length)}</Text>
        </Group>
    )
}
