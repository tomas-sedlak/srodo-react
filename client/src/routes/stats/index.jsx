import { Box, Group, Loader, Text } from "@mantine/core";
import { IconHeart, IconMessageCircle, IconEye } from '@tabler/icons-react';
import { AreaChart } from "@mantine/charts";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";

export default function Stats() {
    const { postId } = useParams();

    const fetchPost = async () => {
        const response = await axios.get(`/api/post/${postId}`);
        let post = response.data
        let views = post.views

        if (views.length != 0) {
            let newViews = []
            let start = moment(views[0].date).subtract(1, "days");
            let end = moment()
            for (let m = start, i = -1; m.isBefore(end); m.add(1, "days")) {
                let newDate, newCount

                // Add day before publish with 0 views so chart will start from 0
                if (i == -1) {
                    newDate = m.format("DD. MMM")
                    newCount = 0
                    i = 0
                } else if (moment(views[i].date).format("DD-MM") == m.format("DD-MM")) {
                    newDate = moment(views[i].date).format("DD. MMM")
                    newCount = views[i].count + newViews[newViews.length - 1].count
                    if (i < views.length - 1) i++
                } else {
                    newDate = m.format("DD. MMM")
                    newCount = newViews[newViews.length - 1].count
                }

                newViews.push({ date: newDate, count: newCount })
            }

            post.views = newViews
        } else {
            delete post.views
        }

        return post
    }

    const { data, status } = useQuery({
        queryFn: fetchPost,
        queryKey: ["postStats", postId],
    })

    return status == "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <Box px="md" py="sm">
            <Text fw={800} fz={24}>{data.title}</Text>

            <Group gap={8}>
                {/* Views */}
                <div className="icon-wrapper">
                    <IconEye stroke={1.25} />
                    <span>{data.views.reduce((acc, view) => acc + view.count, 0)}</span>
                </div>

                {/* Likes */}
                <div className="icon-wrapper">
                    <IconHeart stroke={1.25} />
                    <span>{data.likes.length}</span>
                </div>

                {/* Comments */}
                <div className="icon-wrapper">
                    <IconMessageCircle stroke={1.25} />
                    <span>{data.comments}</span>
                </div>
            </Group>

            <Text mt="md">Zhliadnutia od publikovania</Text>
            {data.views ? (
                <AreaChart
                    mt="sm"
                    h={300}
                    data={data.views}
                    dataKey="date"
                    series={[
                        { name: "count", label: "Views", color: "srobarka" }
                    ]}
                />
            ) : (
                <Text>Zatiaľ žiadne dáta</Text>
            )}
        </Box>
    )
}