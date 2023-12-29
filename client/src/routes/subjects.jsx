import { useState, useEffect } from 'react';
import { Text, Card, Tabs, ActionIcon, Group } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { Link } from "react-router-dom";

const types = [
    {
        label: "Všetko"
    },
    {
        label: "Článok"
    },
    {
        label: "Kvíz"
    },
    {
        label: "Diskusia"
    },
]

export default function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [activeTab, setActiveTab] = useState("Matematika");

    useEffect(() => {
        fetch("http://localhost:3000/categories")
            .then(response => response.json())
            .then(data => setSubjects(data))
    }, [])

    return (
        <>
            <div className="header">
                <Group>
                    <Link to="../">
                        <ActionIcon variant="subtle" color="dark" size="lg" radius="50%">
                            <IconArrowLeft style={{ width: '70%', height: '70%' }} />
                        </ActionIcon>
                    </Link>
                    <Text fw={700} size="xl">Predmety - {activeTab}</Text>
                </Group>
            </div>

            <Card className="custom-card" mb={8}>
                <Text fw={700}>Typ príspevku</Text>
                <Tabs mt={8} variant="unstyled" defaultValue="Všetko">
                    <Tabs.List className="custom-tabs">
                        {types.map(subject => 
                            <Tabs.Tab value={subject.label}>
                                {subject.label}
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                </Tabs>
                
                <Text fw={700} mt="md">Predmet</Text>
                <Tabs mt={8} variant="unstyled" value={activeTab} onChange={setActiveTab}>
                    <Tabs.List className="custom-tabs">
                        {subjects.map(subject => 
                            <Tabs.Tab value={subject.label}>
                                {subject.emoji + " " + subject.label}
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                </Tabs>
            </Card>

        </>
    );
}