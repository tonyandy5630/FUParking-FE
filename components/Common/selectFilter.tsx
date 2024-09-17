import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export interface listFilter {
  display: string;
  value: string;
}

interface SelectFilterProps {
  filterAttribute: string;
  setFilterAttribute: (value: string) => void;
  listFilter: listFilter[];
  label?: string;
  className?: string;
}

export default function SelectFilter({
  filterAttribute,
  setFilterAttribute,
  listFilter,
  label = "Filter",
  className = "",
}: SelectFilterProps) {
  const handleChange = (event: any) => {
    setFilterAttribute(event.target.value);
  };

  return (
    <FormControl
      className={`${className === "" ? "!min-w-40" : className} `}
      size='small'
    >
      <InputLabel id='demo'>{label}</InputLabel>
      <Select
        labelId='demo'
        label={label}
        value={filterAttribute}
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
