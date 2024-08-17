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
};

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  options: Array<FormOptions>;
  error?: string;
}

const FormSelect = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, name, ...props }, ref) => {
    return (
      <ConnectForm>
        {({ control, formState: { errors } }: UseFormReturn) => {
          return (
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <FormControl
                    fullWidth
                    size='small'
                    error={errors[name]?.message !== undefined}
                  >
                    <TextField
                      select
                      size='small'
                      defaultValue={props.defaultValue ?? ""}
                      label={label}
                      {...rest}
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
