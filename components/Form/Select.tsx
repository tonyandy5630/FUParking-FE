import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { Controller, UseFormReturn } from "react-hook-form";
import ConnectForm from "./ConnectForm";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

export type FormOptions = {
  name: string;
  value: string | number;
  disabled?: boolean;
};

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: Array<FormOptions>;
  error?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, name, required = true, ...props }, ref) => {
    return (
      <ConnectForm>
        {({ control, formState: { errors } }: UseFormReturn) => {
          return (
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <FormControl
                    fullWidth
                    size='small'
                    error={errors[name]?.message !== undefined}
                  >
                    <TextField
                      select
                      size='small'
                      required={required}
                      // defaultValue={props.defaultValue ?? ""}
                      label={label}
                      {...field}
                    >
                      {options.map((item, index) => (
                        <MenuItem key={item.value} value={item.value}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FormHelperText>{error}</FormHelperText>
                  </FormControl>
                );
              }}
            />
          );
        }}
      </ConnectForm>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
