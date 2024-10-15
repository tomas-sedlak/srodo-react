import { Group, Text, Switch, useMantineColorScheme, Box } from "@mantine/core";
import { IconHeart, IconChevronRight, IconMoon } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "state";
import SmallHeader from "templates/SmallHeader";

export default function Settings() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const dispatch = useDispatch()

    return (
        <>
            <SmallHeader withArrow title="Nastavenia" />

            <Box mt={8}>
                <SettingsItem data={{ icon: IconHeart, label: "Obľúbené", link: "/ucet/oblubene" }} />

                <Group py={8} px="md">
                    <IconMoon stroke={1.25} />
                    <Text style={{ flex: 1 }}>Tmavý režim</Text>
                    <Switch
                        checked={colorScheme == "dark"}
                        onChange={toggleColorScheme}
                    />
                </Group>

                <Text
                    py={8}
                    px="md"
                    c="red"
                    className="pointer"
                    onClick={() => dispatch(setLogout())}
                >
                    Odhlásiť sa
                </Text>
            </Box>
        </>
    );
}

function SettingsItem({ data }) {
    return (
        <Link to={data.link}>
            <Group py={8} px="md">
                <data.icon stroke={1.25} />
                <Text style={{ flex: 1 }}>{data.label}</Text>
                <IconChevronRight stroke={1.25} />
            </Group>
        </Link>
    );
}