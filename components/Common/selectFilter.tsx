import { MenuItem, Select } from "@mui/material";

interface listFilter {
    display: string;
    value: string;
}

interface SelectFilterProps {
    filterAttribute: string;
    setFilterAttribute: (value: string) => void;
    listFilter: listFilter[];
}

export default function SelectFilter({ filterAttribute, setFilterAttribute, listFilter }: SelectFilterProps) {
    const handleChange = (event: any) => {
        setFilterAttribute(event.target.value);
    };

    return (
        <Select value={filterAttribute} onChange={handleChange}>
            {listFilter.map((item, index) => (
                <MenuItem key={index} value={item.value}>{item.display}</MenuItem>
            ))}
        </Select>
    )
}