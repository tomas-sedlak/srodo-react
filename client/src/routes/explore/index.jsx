import { useQuery } from "@tanstack/react-query";
import Suggestion from "templates/Group";
import axios from "axios";
import { Loader } from "@mantine/core";

export default function Explore() {
    const fetchData = async () => {
        const response = await axios.get("/api/group/suggestions");
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["explore"],
        queryFn: fetchData,
    });

    return status === "pending" ? (
        <div className="loader-center">
            <Loader />
        </div>
    ) : status === "error" ? (
        <div className="loader-center">
            <p>Nastala chyba!</p>
        </div>
    ) : (
        <>
            {data.map(group => (
                <Suggestion group={group} />
            ))}
        </>
    )
}