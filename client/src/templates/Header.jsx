import { Text, Autocomplete, Group, Avatar, Menu, Stack, CloseButton, Drawer, ActionIcon, Button, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconSearch, IconPencilPlus, IconCopyCheck, IconMessageCircleQuestion, IconPlus, IconBell, IconSettings, IconChartBar, IconLogout, IconMenu2 } from '@tabler/icons-react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setLoginModal } from "state";
import Navbar from 'templates/Navbar';

export default function Header() {
    const { colorScheme } = useMantineColorScheme();
    const light = colorScheme === "light";
    const isMobile = useMediaQuery("(max-width: 992px)");
    const [drawerOpened, drawerHandlers] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState("");
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <>
            <header>
                <div className="header-inner">
                    <Group>
                        <ActionIcon
                            variant="subtle"
                            style={!isMobile && { display: "none" }}
                            onClick={drawerHandlers.open}
                            color="gray"
                            c="var(--mantine-color-text)"
                            w={40}
                            h={40}
                            radius="xl"
                        >
                            <IconMenu2 stroke={1.25} />
                        </ActionIcon>

                        <Text fw={700} size="lg" style={isMobile && { display: "none" }}>Šrodo</Text>
                    </Group>

                    <Autocomplete
                        data={["test", "admin"]}
                        width="100%"
                        placeholder="Hľadať"
                        leftSection={<IconSearch stroke={1.25} />}
                        rightSection={
                            searchValue !== "" && (
                                <CloseButton
                                    variant="subtle"
                                    radius="lg"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => setSearchValue("")}
                                    aria-label="Clear value"
                                />
                            )
                        }
                        variant="filled"
                        className="search"
                        styles={{
                            section: {
                                margin: "8px"
                            },
                        }}
                        value={searchValue}
                        onChange={setSearchValue}
                    />

                    {user ? (
                        <Group justify="flex-end" gap={4}>
                            {!isMobile && (
                                <Tooltip label="Notifikácie">
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        c="var(--mantine-color-text)"
                                        w={40}
                                        h={40}
                                        radius="xl"
                                    >
                                        <IconBell stroke={1.25} />
                                    </ActionIcon>
                                </Tooltip>
                            )}

                            <Menu position="bottom-end" width={180}>
                                <Menu.Target>
                                    <Tooltip label="Vytvoriť">
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            c="var(--mantine-color-text)"
                                            w={40}
                                            h={40}
                                            radius="xl"
                                        >
                                            <IconPlus stroke={1.25} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        onClick={() => navigate("/vytvorit/clanok")}
                                        leftSection={<IconPencilPlus stroke={1.25} />}
                                    >
                                        <Text>Článok</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => navigate("/vytvorit/diskusia")}
                                        leftSection={<IconMessageCircleQuestion stroke={1.25} />}
                                    >
                                        <Text>Diskusia</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => navigate("/vytvorit/kviz")}
                                        leftSection={<IconCopyCheck stroke={1.25} />}
                                    >
                                        <Text>Kvíz</Text>
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>

                            <Menu position="bottom-end" width={240}>
                                <Menu.Target>
                                    <Avatar className="pointer" src={user.profilePicture} />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item
                                        onClick={() => navigate(`/${user.username}`)}
                                        leftSection={<Avatar src={user.profilePicture} />}
                                    >
                                        <Stack gap={4}>
                                            <Text fw={700} size="sm" style={{ lineHeight: 1 }}>{user.displayName}</Text>
                                            <Text c="gray" size="sm" style={{ lineHeight: 1 }}>@{user.username}</Text>
                                        </Stack>
                                    </Menu.Item>

                                    <Menu.Divider />

                                    {isMobile && (
                                        <Menu.Item
                                            onClick={() => navigate("/nastavenia")}
                                            leftSection={<IconBell stroke={1.25} />}
                                        >
                                            <Text>Notifikácie</Text>
                                        </Menu.Item>
                                    )}
                                    <Menu.Item
                                        onClick={() => navigate("/nastavenia")}
                                        leftSection={<IconSettings stroke={1.25} />}
                                    >
                                        <Text>Nastavenia</Text>
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => navigate("/statistiky")}
                                        leftSection={<IconChartBar stroke={1.25} />}
                                    >
                                        <Text>Štatistiky</Text>
                                    </Menu.Item>

                                    <Menu.Divider />

                                    <Menu.Item
                                        color="red"
                                        onClick={() => dispatch(setLogout())}
                                        leftSection={<IconLogout stroke={1.25} />}
                                    >
                                        <Text>Odhlásiť sa</Text>
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    ) : (
                        <Button
                            my={10}
                            ml="auto"
                            onClick={() => dispatch(setLoginModal(true))}
                        >
                            Prihlásiť sa
                        </Button>
                    )}
                </div>
            </header >

            <Drawer
                opened={drawerOpened}
                onClose={drawerHandlers.close}
                title="Šrodo"
                size="xs"
                padding="sm"
            >
                <Navbar close={drawerHandlers.close} />
            </Drawer>
        </>
    )
}