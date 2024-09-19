import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectVariants } from "@mui/material/Select";
import { useId } from "react";

export interface listFilter<T = string> {
  display: string;
  value: T;
}

interface SelectFilterProps {
  filterAttribute: string;
  setFilterAttribute: (value: string) => void;
  listFilter: listFilter[];
  label?: string;
  className?: string;
  variant?: SelectVariants;
}

export default function SelectFilter({
  filterAttribute,
  setFilterAttribute,
  listFilter,
  label = "Filter",
  variant,
  className = "",
}: SelectFilterProps) {
  const handleChange = (event: any) => {
    setFilterAttribute(event.target.value);
  };
  const id = useId();

  return (
    <FormControl
      className={`${className === "" ? "!min-w-40" : className} `}
      size='small'
    >
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        label={label}
        value={filterAttribute}
        variant={variant}
        onChange={handleChange}
      >
        {listFilter.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.display}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
