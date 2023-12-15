import { useState, useEffect } from 'react';
import { Text, Box, Tabs } from "@mantine/core";
import Post from "../templates/post";

export default function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/")
            .then(response => response.json())
            .then(posts => setPosts(posts))
    }, [])

    return (
        <>
            <div className="header">
                <Text fw={700} size="xl">Domov</Text>
                <Tabs variant="unstyled" defaultValue="relevant">
                    <Tabs.List className="custom-tabs">
                        <Tabs.Tab
                            size="md"
                            value="relevant"
                        >
                            Relevantné
                        </Tabs.Tab>
                        <Tabs.Tab
                        size="md"
                            value="top"
                        >
                            Top
                        </Tabs.Tab>
                        <Tabs.Tab
                        size="md"
                            value="latest"
                        >
                            Najnovšie
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </div>
            
            <Box mt="xl">
                {posts.map((post) => <Post post={post} />)}
            </Box>
        </>
    )
}