import { Text, Autocomplete, Group, Avatar, Menu, Stack, CloseButton, Drawer, ActionIcon } from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { IconSearch, IconPencilPlus, IconCopyCheck, IconMessageCircleQuestion, IconPlus, IconBell, IconSettings, IconChartBar, IconLogout, IconMenu2 } from '@tabler/icons-react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import Navbar from './navbar';


function clear() {
    document.getElementsByClassName("search").value = "";
}

export default function Header() {

    const isMobile = useMediaQuery("(max-width: 992px)");

    const [opened, setOpened] = useState(false);
    const title = opened ? 'Close navigation' : 'Open navigation';

    const [value, SetValue] = useState("");


    return (
        <>
            <header>
                <div className="header-inner">
                    <Group p="sm" >
                        <ActionIcon
                            variant="subtle"
                            style={{ display: !isMobile ? "none" : "flex" }}                            
                            onClick={() => setOpened((o) => !o)}
                            color="black"
                            size="lg"
                            radius="lg"
                            >
                            <IconMenu2

                            />
                        </ActionIcon>

                        <Text fw={700} size="lg" style={isMobile && { display: "none" }}>Šrodo</Text>
                    </Group>

                    <Autocomplete
                        data={["test", "admin"]}
                        width="100%"
                        placeholder="Hľadať"
                        leftSection={<IconSearch stroke={1.25} />}
                        rightSection={
                            value !== '' && (
                                <CloseButton
                                    variant="subtle"
                                    radius="lg"
                                    c="gray"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => SetValue('')}
                                    aria-label="Clear value"
                                />)
                        }
                        className="search"
                        styles={{
                            section: {
                                margin: "8px"
                            },
                        }}
                        value={value}
                        onChange={SetValue}
                    />

                    {/* NEEDS SOME TWEAKS: add user information and login */}

                    <Group justify="flex-end" p="sm" >
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

            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                title="Šrodo"
            >
                <Navbar />
            </Drawer>
        </>
    )
}