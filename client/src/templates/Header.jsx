import { Text, Autocomplete, Group, Avatar, Menu, Stack, Drawer, ActionIcon, Button, useMantineColorScheme, Switch } from '@mantine/core';
import { IconSearch, IconMoon, IconPencilPlus, IconCopyCheck, IconMessageCircleQuestion, IconSettings, IconChartBar, IconLogout, IconMenu2, IconX, IconUsers } from '@tabler/icons-react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setLoginModal } from "state";
import Navbar from 'templates/Navbar';

export default function Header() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
                    {isMobile ? (
                        <Group>
                            <ActionIcon
                                variant="subtle"
                                onClick={drawerHandlers.open}
                                color="gray"
                                c="var(--mantine-color-text)"
                                w={40}
                                h={40}
                                radius="xl"
                            >
                                <IconMenu2 stroke={1.25} />
                            </ActionIcon>
                        </Group>
                    ) : (
                        <Group gap={8}>
                            {colorScheme === "light" ? <img width={36} height={36} src="/images/logo_light.svg" /> : <img width={36} height={36} src="/images/logo_dark.svg" />}
                            <Text fw={700} size="xl">Šrodo</Text>
                        </Group>
                    )}

                    <Autocomplete
                        data={["test", "admin"]}
                        width="100%"
                        placeholder="Hľadať"
                        leftSection={<IconSearch stroke={1.25} />}
                        rightSection={
                            searchValue !== "" && (
                                <IconX
                                    className="pointer"
                                    onClick={() => setSearchValue("")}
                                    stroke={1.25}
                                />
                            )
                        }
                        className="search"
                        styles={{
                            section: {
                                margin: "8px"
                            },
                        }}
                        value={searchValue}
                        onChange={setSearchValue}
                    />

                    <Group ml="auto" gap={8}>
                        {user ? (
                            <>
                                <Menu position="bottom-end" width={180}>
                                    <Menu.Target>
                                        <Button>Vytvoriť</Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            onClick={() => navigate("/vytvorit/skupina")}
                                            leftSection={<IconUsers stroke={1.25} />}
                                        >
                                            <Text>Skupina</Text>
                                        </Menu.Item>
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

                                        {/* <Menu.Item
                                            onClick={() => navigate("/nastavenia")}
                                            leftSection={<IconBell stroke={1.25} />}
                                        >
                                            <Text>Notifikácie</Text>
                                        </Menu.Item> */}
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
                                        <Menu.Item
                                            leftSection={<IconMoon stroke={1.25} />}
                                        >
                                            <Group justify="space-between">
                                                <Text>Tmavý režim</Text>
                                                <Switch
                                                    checked={colorScheme === "dark"}
                                                    onClick={toggleColorScheme}
                                                />
                                            </Group>
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
                            </>
                        ) : (
                            <Button onClick={() => dispatch(setLoginModal(true))}>
                                Prihlásiť sa
                            </Button>
                        )}
                    </Group>
                </div>
            </header >

            <Drawer
                opened={drawerOpened}
                onClose={drawerHandlers.close}
                size={280}
                padding="sm"
                title={
                    <Group gap={8}>
                        {colorScheme === "light" ? <img width={36} height={36} src="/images/logo_light.svg" /> : <img width={36} height={36} src="/images/logo_dark.svg" />}
                        <Text fw={700} size="xl">Šrodo</Text>
                    </Group>
                }
            >
                <Navbar close={drawerHandlers.close} />
            </Drawer>
        </>
    )
}