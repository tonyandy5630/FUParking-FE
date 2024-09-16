import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import ConnectForm from "./ConnectForm";
import { Controller, UseFormReturn } from "react-hook-form";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FormControl, FormHelperText } from "@mui/material";
import { Moment } from "moment";

interface Props extends DatePickerProps<Moment> {
  name: string;
  error?: string;
  label: string;
}

const FormDatePicker = React.forwardRef<DatePickerProps<Moment>, Props>(
  ({ name, error, minDate, maxDate, label, ...props }, ref) => (
    <ConnectForm>
      {({ control, formState: { errors } }: UseFormReturn) => {
        return (
          <FormControl error={errors[name]?.message !== undefined} fullWidth>
            <Controller
              control={control}
              name={name}
              render={({ field }) => {
                const { value, ...rest } = field;
                return (
                  <DatePicker
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                    format='DD - MM - YYYY'
                    minDate={minDate}
                    maxDate={maxDate}
                    className='w-full'
                    {...field}
                    label={label}
                    {...props}
                  />
                );
              }}
            />
            <FormHelperText>{errors[name]?.message as string}</FormHelperText>
          </FormControl>
        );
      }}
    </ConnectForm>
  )
);

FormDatePicker.displayName = "MyComponent";

export default FormDatePicker;
