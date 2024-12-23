import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import { Loader, Text } from "@mantine/core"
import axios from "axios"
import Post from "templates/Post"
import Message from "templates/Message"
import SmallHeader from "templates/SmallHeader"

export default function Favourites() {
    const userId = useSelector((state) => state.user?._id)

    const fetchFavourites = async () => {
        const response = await axios.get(`/api/user/${userId}/favourites`)
        return response.data
    }

    const { status, data } = useQuery({
        queryKey: ["favourites", userId],
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
            <SmallHeader withArrow title="Obľúbené príspevky" />

            {data.length === 0 &&
                <div className="loader-center">
                    <Message
                        title="Zatiaľ žiadne príspevky"
                        content="Klikni srdce na hocijakom príspevku. Keď tak urobíš, už tu nebude tak prázdno."
                    />
                </div>
            }

            {data.map(post => <Post post={post} />)}
        </>
    )
}