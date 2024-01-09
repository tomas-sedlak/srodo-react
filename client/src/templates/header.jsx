
import { Text, Autocomplete, Group, Avatar, Menu, Flex,} from '@mantine/core';
import { IconSearch, IconPencilPlus , IconCopyCheck, IconMessageCircleQuestion, IconPlus, IconBell, IconSettings, IconChartBar, IconLogout} from '@tabler/icons-react';

function clearThis(target) {
    target.value= "";
}

export default function Header() {


    return (
        <header>
            <div className="header-inner">
                <Text fw={700} size="lg" p="sm">Šrodo</Text>
                <Autocomplete data={["test", "admin"]} placeholder="Hľadať" leftSection={<IconSearch color="black" stroke={1.25} />} className="search" />
                
         
            
                {/* NEEDS SOME TWEAKS: add user information and login */}

                <Group justify="flex-end">
                    <IconBell></IconBell>
                    <Menu width={240}>
                        <Menu.Target>
                            <IconPlus className='MenuTrigger'></IconPlus>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Group>
                                    <IconPencilPlus></IconPencilPlus>
                                    <Text>Článok</Text>
                                </Group>                                
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconMessageCircleQuestion></IconMessageCircleQuestion>
                                    <Text>Diskusia</Text>
                                </Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconCopyCheck></IconCopyCheck>
                                    <Text>Kvíz</Text>
                                </Group>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    
                    <Menu width={240}>
                        <Menu.Target>
                            <Avatar className='MenuTrigger'></Avatar>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Group>
                                    <Avatar size="sm"></Avatar>
                                    <Flex gap={0} direction="column">
                                        <Text size="xs">DisplayName</Text>
                                        <Text size="xs">UserName</Text>
                                    </Flex>
                                </Group>
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconSettings></IconSettings>
                                    <Text>Nastavenia</Text>
                                </Group>                                
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconChartBar></IconChartBar>
                                    <Text>Štatistiky</Text>
                                </Group>                                
                            </Menu.Item>
                            <Menu.Item>
                                <Group>
                                    <IconLogout></IconLogout>
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