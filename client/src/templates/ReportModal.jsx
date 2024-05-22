import { Group, Button, Modal, Radio, Text, RadioGroup } from "@mantine/core";
import { useState } from "react";
import axios from "axios";


export function ReportModal({ opened, close }) {
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

    const [reportReason, setReportReason] = useState(null);
    const [error, setError] = useState(null);

    const handleReport = async () => {
        if (!reportReason) return;

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
            title={<Text fw={700} fz="lg">Nahlásiť príspevok</Text>}
            radius="lg"
            centered
        >
            <RadioGroup
                value={reportReason}
                onChange={setReportReason}
            >
                {reasons.map((reason) => (
                    <Radio mb="sm" key={reason} value={reason} label={reason} />
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
                    onClick={handleReport}
                    disabled={!reportReason}
                >
                    Nahlásiť
                </Button>
            </Group>
        </Modal >
    )
}