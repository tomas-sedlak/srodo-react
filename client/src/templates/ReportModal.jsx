import { Group, Button, Modal, Radio } from "@mantine/core";
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

    // const [opened, { open, close }] = useDisclosure(false);
    const [reportReason, setReportReason] = useState('');

    const handleReport = async () => {
        if (reportReason.trim() === '') return;

        await axios.post(`/api/report/${post._id}`, { reason: reportReason }, { headers });
        setReportModalOpened(false);
        setReportReason('');
    }



    return (
        <Modal
            opened={opened}
            onClose={event => {
                close()
                setReportReason('')
            }}
            title="Nahlásiť príspevok"
            centered
            radius="lg"
        >
            <Radio.Group
                value={reportReason}
                onChange={setReportReason}
            >
                {reasons.map((reason) => (

                    <Radio key={reason} value={reason} label={reason} p="sm" />

                ))}
            </Radio.Group>
            <Group mt="md" justify="flex-end">
                <Button variant="outline" onClick={() => {
                    close()
                    setReportReason('')
                }}>
                    Zrušiť
                </Button>
                <Button color="red" onClick={handleReport} disabled={!reportReason} >
                    Nahlásiť
                </Button>
            </Group>
        </Modal >
    )
}