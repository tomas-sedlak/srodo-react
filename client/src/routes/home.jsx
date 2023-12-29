import { useState, useEffect } from 'react';
import { Tabs } from "@mantine/core";
import Post from "../templates/post";
import Header from "../templates/header";

export default function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:3000/")
            .then(response => response.json())
            .then(data => setPosts(data))
    }, [])

    return (
        <>
            <div className="header">
                <Tabs defaultValue="top" variant="unstyled" h="100%" style={{ flex: 1 }}>
                    <Tabs.List className="custom-tabs-home">
                        <Tabs.Tab value="top">
                            Top
                        </Tabs.Tab>
                        <Tabs.Tab value="latest">
                            Najnovšie
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </div>

            {posts.map((post) => <Post post={post} />)}
        </>
    )
}