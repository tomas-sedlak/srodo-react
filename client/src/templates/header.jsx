import { Text, Autocomplete } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function Header() {
    return (
        <header>
            <div className="header-inner">
                <Text fw={700} size="lg" p="sm">Šrodo</Text>
                <Autocomplete data={["test", "admin"]} placeholder="Hľadať" leftSection={<IconSearch color="black" stroke={1.25} />} className="search" />

                {/* TODO: add user information and login */}
            </div>
        </header>
    )
}