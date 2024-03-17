import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { Box, Loader, Text } from "@mantine/core"
import axios from "axios"
import Post from "templates/post"

export default function Favourites() {
    const userId = useSelector((state) => state.user?._id)

    const fetchFavourites = async () => {
        const response = await axios.get(`/api/user/${userId}/favourites`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["favourites"],
        queryFn: fetchFavourites,
    })

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
            <Text>Už to bude 😉</Text>
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            <Box p="sm" className="border-bottom">
                <Text fw={600}>Moje obľúbené príspevky</Text>
            </Box>

            {data.length === 0 && (
                <Box mx="auto" p="xl" maw={420}>
                    <Text ta="center" fw={800} fz={24} style={{ lineHeight: 1.2 }}>Zatiaľ žiadne príspevky</Text>
                    <Text ta="center" c="gray" mt={8}>Klikni srdce na hocijakom príspevku. Keď tak urobíš, už tu nebude tak prázdno.</Text>
                </Box>
            )}

            {data.map(post => <Post post={post} />)}
        </>
    )
}