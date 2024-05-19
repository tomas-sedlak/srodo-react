import { Modal, Text } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import { setLoginModal } from "state";
import Login from "routes/login";

export default function LoginModal() {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const opened = useSelector(state => state.loginModal);
    const dispatch = useDispatch();

    return (
        <Modal
            opened={opened}
            onClose={() => dispatch(setLoginModal(false))}
            padding={isMobile ? "sm" : "lg"}
            size="sm"
            radius={isMobile ? 0 : "lg"}
            fullScreen={isMobile}
            centered
            title={<Text fw={700} fz="lg">Prihlásiť sa na Šrodo</Text>}
        >
            <Login modal />
                    {/* <Text c="dimmed">Zaslali sme email s overovacím linkom na <Text component="span" fw={600} c="white">{values.email}</Text></Text>
                    <Text mt={8}>Pokiaľ nepotvrdíš svoj email nebudeš môcť využívať funkcie účtu.</Text> */}
        </Modal>
    );
}