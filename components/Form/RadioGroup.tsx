import React, { lazy, forwardRef, useMemo } from "react";
import ConnectForm from "./ConnectForm";
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormOptions } from "./Select";

interface Props extends RadioGroupProps {
  name: string;
  options: FormOptions[];
  label: string;
  required?: boolean;
}

function FormRadioGroup({
  name,
  defaultValue,
  options,
  row,
  label,
  required = true,
}: Props) {
  const radioOptions = useMemo(() => {
    if (options.length === 0) {
      return [];
    }

    return options.map((item) => {
      return (
        <FormControlLabel
          disabled={item.disabled}
          key={item.value}
          value={item.value}
          control={<Radio />}
          label={item.name}
        />
      );
    });
  }, [options.length]);

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
                  <FormLabel required={required}>{label}</FormLabel>
                  <RadioGroup
                    {...rest}
                    defaultValue={defaultValue ?? ""}
                    row={row}
                  >
                    {radioOptions}
                  </RadioGroup>
                  <FormHelperText>
                    {errors[name]?.message ? String(errors[name]?.message) : ""}
                  </FormHelperText>
                </FormControl>
              );
            }}
          />
        );
      }}
    </ConnectForm>
  );
}

FormRadioGroup;
export default FormRadioGroup;
