import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader, TextInput, Stack, Tabs } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { UserProfile } from "routes/group";
import Suggestion from "templates/Group";
import axios from "axios";

export default function Explore() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const q = searchParams.get("q") || "";
    const tab = searchParams.get("tab") || "skupiny";

    const [searchValue, setSearchValue] = useState(q);

    const handleFormSubmit = event => {
        event.preventDefault()
        setSearchParams({ q: searchValue, tab })
    }

    const handleClear = () => {
        setSearchValue("")
        setSearchParams({ tab })
    }

    const fetchData = async () => {
        const response = await axios.get(`/api/${tab === "skupiny" ? "group" : "user"}/suggestions?q=${searchValue}`);
        return response.data;
    }

    const { status, data } = useQuery({
        queryKey: ["explore", q, tab],
        queryFn: fetchData,
    });

    return (
        <>
            <Helmet>
                <title>Preskúmať / Šrodo</title>
                <meta name="description" content="Nájdi zaujímavé učebné matriály alebo skupiny na Šrodo." />
            </Helmet>

            <Stack gap={0} px="md" pt={8} className="border-bottom" pos="sticky" top={0} bg="var(--mantine-color-body)" style={{ zIndex: 98 }}>
                <form onSubmit={handleFormSubmit}>
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

                <Tabs
                    px="md"
                    variant="unstyled"
                    value={tab}
                    onChange={newTab => {
                        setSearchParams({ q, tab: newTab })
                    }}
                >
                    <Tabs.List grow className="custom-tabs">
                        <Tabs.Tab m={0} value="skupiny">
                            Skupiny
                        </Tabs.Tab>
                        <Tabs.Tab m={0} value="pouzivatelia">
                            Používatelia
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Stack>

            {status === "pending" ? (
                <div className="loader-center">
                    <Loader />
                </div>
            ) : status === "error" ? (
                <div className="loader-center">
                    <p>Nastala chyba!</p>
                </div>
            ) : (
                <>
                    {tab === "skupiny" && data.map(group => (
                        <Suggestion group={group} />
                    ))}

                    {tab === "pouzivatelia" && data.map(user => (
                        <UserProfile user={user} />
                    ))}
                </>
            )}
        </>
    )
}