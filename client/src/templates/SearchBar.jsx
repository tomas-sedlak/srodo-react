import { Autocomplete } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';

export default function SearchBar( {searchValue, setSearchValue} ) {

    return (

        <Autocomplete
            width="100%"
            placeholder="Hľadať"
            leftSection={<IconSearch stroke={1.25} />}
            rightSection={
                searchValue !== "" && (
                    <IconX
                        className="pointer"
                        onClick={() => setSearchValue("")}
                        stroke={1.25}
                    />
                )
            }
            className="search"
            styles={{
                section: {
                    margin: "8px"
                },
            }}
            value={searchValue}
            onChange={setSearchValue}
        />
    )
}