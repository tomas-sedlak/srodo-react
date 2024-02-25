import { useState, useEffect } from "react";
import { Box, Text } from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Stats() {
    const { postId } = useParams();
    const [post, setPost] = useState([]);

    const fetchPost = async () => {
        const response = await axios.get(`/api/post/${postId}`);
        let views = response.data.views
        views.reduce((acc, views) => {
            let count = views.count
            views.count = acc
            return acc + count
        }, 0)

        const now = new Date();
        let newViews = [];
        for (var d = new Date(views[0].date), i = 0; d <= now; d.setDate(d.getDate() + 1)) {
            if (d.toISOString().split("T")[0] == new Date(views[i].date).toISOString().split("T")[0]) {
                newViews.push(views[i])
                if (i < views.length - 1) i++
            } else {
                newViews.push({
                    date: d.toISOString().split("T")[0],
                    count: views[i].count
                })
            }
        }

        response.data.views = newViews
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