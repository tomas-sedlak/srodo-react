import { useState, useEffect } from 'react';
import { Text, Box, Card, Image, Group, Tabs } from "@mantine/core";
import Header from "templates/header";

const categories = [
    {
        label: "veda"
    },
    {
        label: "technologie"
    }
]

export default function News() {
    const [activeTab, setActiveTab] = useState("veda");

    return (
        <>
            <Card className="custom-card" mb={8}>
                <Tabs variant="unstyled" value={activeTab} onChange={setActiveTab}>
                    <Tabs.List className="custom-tabs">
                        {categories.map(subject => 
                            <Tabs.Tab value={subject.label}>
                                {subject.label}
                            </Tabs.Tab>
                        )}
                    </Tabs.List>
                </Tabs>
            </Card>

            <Card className="custom-card" mb={8}>
                <Group>
                    <Box>
                        <Text>V gejzíroch ľadového mesiaca Saturnu môžeme objaviť stavebné kamene života</Text>
                        <Text>zive.sk</Text>
                    </Box>
                </Group>
            </Card>
        </>
    )
}