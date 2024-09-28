import React from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import ConnectForm from "./ConnectForm";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

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

const FormSelectSearch = React.forwardRef<HTMLSelectElement, Props>(
  ({ label, error, options, name, required = true, ...props }, ref) => {
    return (
      <ConnectForm>
        {({
          control,
          formState: { errors },
          reset,
          getValues,
        }: UseFormReturn) => {
          return (
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                const { value, onChange, ...rest } = field;

                // Handle form reset logic directly within the render method
                const currentValue = getValues(name);
                if (currentValue === "" && value !== "") {
                  onChange("");
                }

                return (
                  <FormControl
                    fullWidth
                    size='small'
                    error={errors[name]?.message !== undefined}
                  >
                    <Autocomplete
                      options={options}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) =>
                        option.value === value.value
                      }
                      value={
                        options.find((option) => option.value === value) || null
                      }
                      onChange={(event, newValue) => {
                        onChange(newValue ? newValue.value : "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={label}
                          required={required}
                          size='small'
                          error={errors[name]?.message !== undefined}
                        />
                      )}
                      {...rest}
                    />
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

FormSelectSearch.displayName = "FormSelect";

export default FormSelectSearch;
