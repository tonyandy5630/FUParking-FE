import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ChangeEvent, FC, useState } from 'react';

interface SearchFieldProps {
    inputValue: string;
    setInputValue: (value: string) => void;
}

const SearchField: FC<SearchFieldProps> = ({ inputValue, setInputValue }) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <TextField
            type='text'
            className='border border-gray-400 rounded-md p-2'
            placeholder='Search ...'
            value={inputValue}
            onChange={handleInputChange}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchField;