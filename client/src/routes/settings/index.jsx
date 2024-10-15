import { Group, Text, Switch, useMantineColorScheme } from "@mantine/core";
import { IconHeart, IconChevronRight, IconMoon } from "@tabler/icons-react";
import SmallHeader from "templates/SmallHeader";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "state";

export default function Settings() {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme()
    const dispatch = useDispatch()

    return (
        <>
            <SmallHeader withArrow title="Nastavenia" />

            <SettingsItem data={{ icon: IconHeart, label: "Obľúbené", link: "/ucet/oblubene" }} />

            <Group py="sm" px="md">
                <IconMoon stroke={1.25} />
                <Text style={{ flex: 1 }}>Tmavý režim</Text>
                <Switch
                    checked={colorScheme == "dark"}
                    onChange={toggleColorScheme}
                />
            </Group>

            <Text
                py="sm"
                px="md"
                c="red"
                className="pointer"
                onClick={() => dispatch(setLogout())}
            >
                Odhlásiť sa
            </Text>
        </>
    );
}

function SettingsItem({ data }) {
    return (
        <Link to={data.link}>
            <Group py="sm" px="md">
                <data.icon stroke={1.25} />
                <Text style={{ flex: 1 }}>{data.label}</Text>
                <IconChevronRight stroke={1.25} />
            </Group>
        </Link>
    );
}