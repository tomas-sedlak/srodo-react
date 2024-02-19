import { Text, Autocomplete, Group, Avatar, Menu, Stack, CloseButton, Drawer, ActionIcon, Button } from '@mantine/core';
import { IconSearch, IconPencilPlus, IconCopyCheck, IconMessageCircleQuestion, IconPlus, IconBell, IconSettings, IconChartBar, IconLogout, IconMenu2 } from '@tabler/icons-react';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLogout, setLoginModal } from "state";
import Navbar from 'templates/Navbar';

export default function Header() {
    const isMobile = useMediaQuery("(max-width: 992px)");
    const [drawerOpened, drawerHandlers] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState("");
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    return (
        <>
            <header>
                <div className="header-inner">
                    <Group>
                        <ActionIcon
                            variant="subtle"
                            style={!isMobile && { display: "none" }}
                            onClick={drawerHandlers.open}
                            c="black"
                            color="gray"
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
                                    c="gray"
                                    onMouseDown={(event) => event.preventDefault()}
                                    onClick={() => setSearchValue("")}
                                    aria-label="Clear value"
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

                    {user ? (
                        <Group justify="flex-end" gap={4}>
                            <ActionIcon
                                variant="subtle"
                                c="black"
                                color="gray"
                                w={40}
                                h={40}
                                radius="xl"
                            >
                                <IconBell stroke={1.25} />
                            </ActionIcon>

                            <Menu position="bottom-end" width={180}>
                                <Menu.Target>
                                    <ActionIcon
                                        variant="subtle"
                                        c="black"
                                        color="gray"
                                        w={40}
                                        h={40}
                                        radius="xl"
                                    >
                                        <IconPlus stroke={1.25} />
                                    </ActionIcon>
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
                                    <Avatar className="pointer" src={user.profilePicture} />
                                </Menu.Target>
                                <Menu.Dropdown>
                                    <Menu.Item>
                                        <Link to={`/${user.username}`}>
                                            <Group>
                                                <Avatar src={user.profilePicture} />
                                                <Stack gap={4}>
                                                    <Text fw={700} size="sm" style={{ lineHeight: 1 }}>{user.displayName}</Text>
                                                    <Text c="gray" size="sm" style={{ lineHeight: 1 }}>@{user.username}</Text>
                                                </Stack>
                                            </Group>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item>
                                        <Link to="/nastavenia">
                                            <Group>
                                                <IconSettings stroke={1.25} />
                                                <Text>Nastavenia</Text>
                                            </Group>
                                        </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <Group>
                                            <IconChartBar stroke={1.25} />
                                            <Text>Štatistiky</Text>
                                        </Group>
                                    </Menu.Item>
                                    <Menu.Item color="red" onClick={() => dispatch(setLogout())}>
                                        <Group>
                                            <IconLogout stroke={1.25} />
                                            <Text>Odhlásiť sa</Text>
                                        </Group>
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
            </header>

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