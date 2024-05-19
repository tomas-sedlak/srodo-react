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
            size="sm"
            radius="lg"
            padding={isMobile ? "md" : "lg"}
            centered
            title={<Text fw={700} fz="lg">Prihlásiť sa na Šrodo</Text>}
            onClose={() => dispatch(setLoginModal(false))}
        >
            <Login modal />
        </Modal>
    );
}