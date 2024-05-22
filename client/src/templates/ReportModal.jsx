import { useState } from "react";
import { Group, Button, Modal, Radio, Text, RadioGroup } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";

const reasons = [
    "Sexuálny obsah",
    "Násilný alebo odpudivý obsah",
    "Nenávistný alebo urážlivý obsah",
    "Obťažovanie alebo šikanovanie",
    "Nebezpečné alebo škodlivé činnosti",
    "Nepravdivé informácie",
    "Zneužívanie detí",
    "Propagácia terorizmu",
    "Spam alebo zavádzajúci obsah",
    "Právna záležitosť",
];

export function ReportModal({ opened, close }) {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [reportReason, setReportReason] = useState(null);
    const [error, setError] = useState(null);

    const handleReport = async () => {
        try {
            await axios.post(`/api/report/${post._id}`, { reason: reportReason }, { headers });
            setReportModalOpened(false);
            setReportReason(null);
        } catch (err) {
            setError(err.response.message)
        }
    }

    return (
        <Modal
            opened={opened}
            onClose={() => {
                close()
                setReportReason(null)
            }}
            onClick={(event) => event.stopPropagation()}
            title={<Text fw={700} fz="lg">Nahlásiť príspevok</Text>}
            size="sm"
            radius="lg"
            padding={isMobile ? "md" : "lg"}
            centered
        >
            <RadioGroup
                value={reportReason}
                onChange={setReportReason}
            >
                {reasons.map((reason) => (
                    <Radio mb="md" key={reason} value={reason} label={reason} />
                ))}
            </RadioGroup>

            {error && <Text c="red">{error}</Text>}

            <Group mt="md" justify="flex-end" gap={8}>
                <Button
                    variant="default"
                    onClick={() => {
                        close()
                        setReportReason(null)
                    }}
                >
                    Zrušiť
                </Button>
                <Button
                    color="red"
                    onClick={close}
                    disabled={!reportReason}
                >
                    Nahlásiť
                </Button>
            </Group>
        </Modal >
    )
}