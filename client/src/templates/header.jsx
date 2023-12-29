import { Link } from "react-router-dom";
import { Text, Group, ActionIcon } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';

export default function Header({ title, arrowBack, rightSide }) {
    return (
        <div className="header">
            {arrowBack ?
                <Group>
                    <Link to="../">
                        <ActionIcon variant="subtle" color="dark" size="lg" radius="50%">
                            <IconArrowLeft style={{ width: '70%', height: '70%' }} />
                        </ActionIcon>
                    </Link>
                    <Text fw={700} size="xl" style={{ lineHeight: 1 }}>{title}</Text>
                </Group>
                :
                <Text fw={700} size="xl" style={{ lineHeight: 1 }}>{title}</Text>
            }
            {rightSide}
        </div>
    )
}