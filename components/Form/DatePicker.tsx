import React, { HTMLInputTypeAttribute } from "react";
import ConnectForm from "./ConnectForm";
import { Controller, UseFormReturn } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: string;
  label: string;
  minDate?: any;
  maxDate?: string;
}

const FormDatePicker = React.forwardRef<HTMLInputTypeAttribute, Props>(
  ({ name, error, minDate, maxDate, label, ...props }, ref) => (
    <ConnectForm>
      {({ control, formState: { errors } }: UseFormReturn) => {
        return (
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  slotProps={{ textField: { size: "small" } }}
                  format='DD - MM - YYYY'
                  minDate={minDate}
                  maxDate={maxDate}
                  className='w-full'
                  {...field}
                  label={label}
                />
              </LocalizationProvider>
            )}
          />
        );
      }}
    </ConnectForm>
  )
);

export default FormDatePicker;
