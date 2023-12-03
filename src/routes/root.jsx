import { useState } from 'react';
import { Outlet } from "react-router-dom";
import { AppShell, Group, Box, Button, TextInput, Text, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function Root() {
    const [opened, setOpened] = useState(false);
    
    return (
        <>
            <header>
                <Group h="100%" maw={1280} m="auto" px="md" justify="space-between">
                    <Group>
                        <Text fw={700}>Srodo</Text>
                        <TextInput
                            w={400}
                            placeholder="Search..."
                            rightSection={
                                <ActionIcon variant="subtle">
                                    <IconSearch />
                                </ActionIcon>
                            }
                        />
                    </Group>
                    <Group gap="xs">
                        <Button>Login</Button>
                        <Button variant="outline">Sign up</Button>
                    </Group>
                </Group>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    )
}