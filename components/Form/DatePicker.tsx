import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import ConnectForm from "./ConnectForm";
import { Controller, UseFormReturn } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, FormHelperText } from "@mui/material";
import dayjs from "dayjs";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  label: string;
  minDate?: any;
  maxDate?: string;
}

const FormDatePicker = React.forwardRef<HTMLInputElement, Props>(
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
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
                      {...rest}
                      label={label}
                    />
                  </LocalizationProvider>
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
