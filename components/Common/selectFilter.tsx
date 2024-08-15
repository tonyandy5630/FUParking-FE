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
}

export default function SelectFilter({
  filterAttribute,
  setFilterAttribute,
  listFilter,
  label = "Filter",
}: SelectFilterProps) {
  const handleChange = (event: any) => {
    setFilterAttribute(event.target.value);
  };

  return (
    <FormControl className='!min-w-44'>
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
