import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FC } from 'react';
import { CustomerWithFillerKey } from '@/types/customer.type';

interface SelectFilterProps {
    filterAttribute: CustomerWithFillerKey;
    setFilterAttribute: (value: CustomerWithFillerKey) => void;
}

const SelectFilter: FC<SelectFilterProps> = ({ filterAttribute, setFilterAttribute }) => {
    const handleChange = (event: SelectChangeEvent<CustomerWithFillerKey>) => {
        setFilterAttribute(event.target.value as CustomerWithFillerKey);
    };

    return (
        <Select value={filterAttribute} onChange={handleChange}>
            <MenuItem value={'fullName'}>Name</MenuItem>
            <MenuItem value={'email'}>Email</MenuItem>
            <MenuItem value={'customerType'}>Type Customer</MenuItem>
            <MenuItem value={'statusCustomer'}>Status</MenuItem>
        </Select>
    );
};

export default SelectFilter;