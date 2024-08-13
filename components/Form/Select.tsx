import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Controller, UseFormReturn } from "react-hook-form";
import ConnectForm from "./ConnectForm";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

export type FormOptions = {
  name: string;
  value: string;
};

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: Array<FormOptions>;
}

const FormSelect = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, value = "", onChange, options, name, ...props }, ref) => {
    return (
      <ConnectForm>
        {({ control, formState: { errors } }: UseFormReturn) => {
          return (
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <FormControl fullWidth size='small'>
                  <InputLabel id='demo'>{label}</InputLabel>
                  <Select labelId='demo' label={label} {...field} value={value}>
                    {options.map((item, index) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          );
        }}
      </ConnectForm>
    );
  }
);

export default FormSelect;
