import { Text, Autocomplete, Group, Avatar, Menu, Stack } from '@mantine/core';
import { IconSearch, IconPencilPlus, IconCopyCheck, IconMessageCircleQuestion, IconPlus, IconBell, IconSettings, IconChartBar, IconLogout, IconX } from '@tabler/icons-react';
import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header>
            <div className="header-inner">
                <Text fw={700} size="lg" p="sm">Šrodo</Text>
                <Autocomplete
                    data={["test", "admin"]}
                    placeholder="Hľadať"
                    leftSection={<IconSearch stroke={1.25} />}
                    className="search"
                />

                {/* NEEDS SOME TWEAKS: add user information and login */}

                <Group justify="flex-end">
                    <IconBell className="pointer" stroke={1.25} />

                    <Menu position="bottom-end" width={180}>
                        <Menu.Target>
                            <IconPlus className="pointer" stroke={1.25} />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Link to="/novy/clanok">
                                    <Group>
                                        <IconPencilPlus stroke={1.25} />
                                        <Text>Článok</Text>
                                    </Group>
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/novy/diskusia">
                                    <Group>
                                        <IconMessageCircleQuestion stroke={1.25} />
                                        <Text>Diskusia</Text>
                                    </Group>
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/novy/kviz">
                                    <Group>
                                        <IconCopyCheck stroke={1.25} />
                                        <Text>Kvíz</Text>
                                    </Group>
                                </Link>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>

                    <Menu position="bottom-end" width={240}>
                        <Menu.Target>
                            <Avatar className="pointer" />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Group>
                                    <Avatar />
                                    <Stack gap={4}>
                                        <Text fw={700} size="sm" style={{ lineHeight: 1 }}>DisplayName</Text>
                                        <Text c="gray" size="sm" style={{ lineHeight: 1 }}>@username</Text>
                                    </Stack>
                                </Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconSettings stroke={1.25} />
                                    <Text>Nastavenia</Text>
                                </Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconChartBar stroke={1.25} />
                                    <Text>Štatistiky</Text>
                                </Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconLogout stroke={1.25} />
                                    <Text>Odhlásiť sa</Text>
                                </Group>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

            </div>
        </header>
    )
}