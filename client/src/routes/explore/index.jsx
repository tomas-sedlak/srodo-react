import { useNavigate, useParams } from "react-router-dom";
import { Loader, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Suggestion from "templates/Group";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";

export default function Explore() {
    const { tab = "popularne" } = useParams();
    const navigate = useNavigate();

    const fetchData = async () => {
        const response = await axios.get(`/api/group/suggestions?sort=${tab}`);
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["explore", tab],
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
            <Helmet>
                <title>Preskúmať / Šrodo</title>
                <meta name="description" content="Nájdi zaujímavé učebné matriály alebo skupiny na Šrodo." />
            </Helmet>

            <SmallHeader title={
                <Tabs
                    px="md"
                    variant="unstyled"
                    value={tab}
                    onChange={newTab => {
                        navigate(`/preskumat/${newTab}`)
                    }}
                >
                    <Tabs.List className="custom-tabs">
                        <Tabs.Tab value="popularne">
                            Populárne
                        </Tabs.Tab>
                        <Tabs.Tab value="najnovsie">
                            Najnovšie
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            } />

            {data.map(group => (
                <Suggestion group={group} />
            ))}
        </>
    )
}