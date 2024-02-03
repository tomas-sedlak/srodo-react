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
    Flex
} from "@mantine/core";
import { GoogleIcon } from "./GoogleIcon";
import { IconBrandFacebook } from "@tabler/icons-react";

export default function Login() {
    return (
        <>

            <Center>
                <Paper withBorder shadow="md" p={30} mt={30} radius="lg" w={350}>
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


                </Paper >
            </Center>


        </>

    );
}