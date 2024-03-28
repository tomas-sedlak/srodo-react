import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { Loader, Text } from "@mantine/core"
import axios from "axios"
import Post from "templates/post"
import Message from "templates/Message"
import SmallHeader from "templates/SmallHeader"

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
            <SmallHeader title="❤️ Moje obľúbené príspevky" />

            {data.length === 0 && <Message
                title="Zatiaľ žiadne príspevky"
                content="Klikni srdce na hocijakom príspevku. Keď tak urobíš, už tu nebude tak prázdno."
            />}

            {data.map(post => <Post post={post} />)}
        </>
    )
}