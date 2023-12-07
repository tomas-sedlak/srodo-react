import { Link } from "react-router-dom";
import { useState } from 'react';
import { Outlet } from "react-router-dom";
import { Box, Group, Button, TextInput, Text, ActionIcon, Menu, Avatar, Indicator, rem } from '@mantine/core';
import { IconSearch, IconLogout, IconSettings, IconPlus, IconBell } from '@tabler/icons-react';

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
                    <Group gap="sm">
                        {/* <Button>Login</Button>
                        <Button variant="outline">Sign up</Button> */}
                        <Link to="new">
                            <Button>
                                Create post
                            </Button>
                        </Link>
                        <Menu width={240} position="bottom-end" radius="md">
                            <Menu.Target>
                                <Avatar src="https://wallpapers-clan.com/wp-content/uploads/2022/05/meme-pfp-13.jpg" />
                            </Menu.Target>

                            <Menu.Dropdown p={8}>
                                <Menu.Item className="menu-item">
                                    <Text fw={600} size="md" mb={4} style={{ lineHeight: 1 }}>
                                        Display Name
                                    </Text>
                                    <Text
                                        c="gray"
                                        size="sm"
                                        style={{ lineHeight: 1 }}
                                    >
                                        @username
                                    </Text>
                                </Menu.Item>

                                <Menu.Divider my={8} />

                                <Menu.Item className="menu-item" fz="md" leftSection={<IconPlus style={{ width: rem(18), height: rem(18) }} />}>
                                    Create post
                                </Menu.Item>
                                <Menu.Item
                                    fz="md"
                                    className="menu-item"
                                    leftSection={
                                        <Indicator inline label="4" size={16}>
                                            <IconBell style={{ width: rem(18), height: rem(18) }} />
                                        </Indicator>
                                    }
                                >
                                    Notifications
                                </Menu.Item>
                                <Menu.Item className="menu-item" fz="md" leftSection={<IconSettings style={{ width: rem(18), height: rem(18) }} />}>
                                    Settings
                                </Menu.Item>

                                <Menu.Divider my={8} />

                                <Menu.Item className="menu-item" color="red" fz="md" leftSection={<IconLogout style={{ width: rem(18), height: rem(18) }} />}>
                                    Log out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>

                    </Group>
                </Group>
            </header>

            <main>
                <Box mt={60}>
                    <Outlet />
                </Box>
            </main>
        </>
    )
}