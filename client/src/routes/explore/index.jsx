import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Suggestion from "templates/Group";
import SmallHeader from "templates/SmallHeader";
import axios from "axios";

export default function Explore() {
    const [searchParams, setSearchParams] = useSearchParams();
    const q = searchParams.get("q") || "";
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const handleFormSubmit = event => {
        event.preventDefault()
        navigate(`/preskumat?q=${searchValue}`)
    }

    const handleClear = () => {
        setSearchValue("")
        navigate(`/preskumat`)
    }

    const fetchData = async () => {
        const response = await axios.get(`/api/group/suggestions?q=${searchValue}`);
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["explore", q],
        queryFn: fetchData,
    });

    return (
        <>
            <Helmet>
                <title>Preskúmať / Šrodo</title>
                <meta name="description" content="Nájdi zaujímavé učebné matriály alebo skupiny na Šrodo." />
            </Helmet>

            <SmallHeader title={
                <form style={{ flex: 1 }} onSubmit={handleFormSubmit}>
                    <TextInput
                        name="q"
                        placeholder="Hľadať"
                        value={searchValue}
                        onChange={event => setSearchValue(event.currentTarget.value)}
                        leftSection={<IconSearch stroke={1.25} />}
                        rightSection={
                            searchValue !== "" && (
                                <IconX
                                    className="pointer"
                                    onClick={handleClear}
                                    stroke={1.25}
                                />
                            )
                        }
                    />
                </form>
            } />

            {status === "pending" ? (
                <div className="loader-center">
                    <Loader />
                </div>
            ) : status === "error" ? (
                <div className="loader-center">
                    <p>Nastala chyba!</p>
                </div>
            ) : data.map(group => (
                <Suggestion group={group} />
            ))}
        </>
    )
}