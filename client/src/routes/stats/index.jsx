import { Box, Text } from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Stats() {
    const [post, setPost] = useState([]);
    const postId = "65c690ec78f68a71a4d8c3c3";

    const fetchPost = async () => {
        const response = await axios.get(`/api/post/${postId}`);
        setPost(response.data);
    }

    useEffect(() => {
        fetchPost();
    }, [])

    return (
        <Box p="sm">
            <Text fw={800} fz={24}>{post.title}</Text>
            <AreaChart
                mt="sm"
                h={300}
                data={post.views}
                dataKey="date"
                series={[
                    { name: "count", label: "Views", color: "srobarka" }
                ]}
            />
        </Box>
    )
}