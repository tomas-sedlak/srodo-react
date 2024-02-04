import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
    Divider,
    Flex,
    Modal
} from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { GoogleIcon } from "./GoogleIcon";
import { IconBrandFacebook } from "@tabler/icons-react";

export default function LoginModal({ opened, close }) {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Modal
            opened={opened}
            onClose={close}
            padding="sm"
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
        >
            <Title align="center" >
                Welcome back!
            </Title>

            <TextInput label="Email" placeholder="example@srodo.sk" />
            <Flex justify="Space-between" mt="md" >
                <Text>Password</Text>
                <Anchor href="#" size="sm" c="dimmed" >
                    Forgot password?
                </Anchor>
            </Flex>
            <PasswordInput placeholder="Heslo" />
            <Flex justify="flex-end">
                <Anchor href="#" c="dimmed" size="sm" >
                    Nemáte účet? Zaregistrujte sa
                </Anchor>
            </Flex>
            <Button fullWidth mt="xl">
                Sign in
            </Button>
            <Divider label="Or" labelPosition="center" p="md" />
            <Group grow gap="md" justify="Space-between" >
                <Button leftSection={<GoogleIcon />} variant="default" color="gray" >
                    Google
                </Button>
                <Button leftSection={<IconBrandFacebook stroke={1.25} />} variant="default" color="gray">
                    Google
                </Button>
            </Group>
        </Modal>
    );
}