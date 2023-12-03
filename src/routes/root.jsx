import { useState } from 'react';
import { Outlet } from "react-router-dom";
import { AppShell, Group, Box, Button, TextInput, Text, ActionIcon } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

export default function Root() {
    const [opened, setOpened] = useState(false);
    
    return (
        <AppShell
        layout="alt"
            header={{ height: 60 }}
            // navbar={{ width: 300}}
        >
            <AppShell.Header>
                <Group h="100%" maw={1100} m="auto" px="md" justify="space-between">
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
            </AppShell.Header>
            {/* <AppShell.Navbar p="md">
                Navbar
            </AppShell.Navbar> */}
            <AppShell.Main>
                <Box bg="#f8f8f8">
                    <Outlet />
                </Box>
            </AppShell.Main>
        </AppShell>
        // <header>

        // </header>
    )
}