import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent, FC } from "react";

interface SearchFieldProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  placeholder?: string;
}

const SearchField: FC<SearchFieldProps> = ({
  inputValue,
  setInputValue,
  placeholder = "Search ...",
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <TextField
      size='small'
      autoFocus={true}
      type='text'
      className='border border-gray-400 rounded-md p-2'
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchField;
