import { Link } from "react-router-dom";
import { Text, Autocomplete, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function Header({ title, arrowBack, rightSide }) {
    return (
        <header>
            <div className="header-inner">
                <Text fw={700} size="lg" p="sm">Šrodo</Text>
                <Autocomplete data={["test", "admin"]} placeholder="Hľadať" leftSection={<IconSearch color="black" stroke={1.25} />} className="search" />
            </div>
            {/* {arrowBack ?
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
            {rightSide} */}
        </header>
    )
}