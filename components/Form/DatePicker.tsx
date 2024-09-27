import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import ConnectForm from "./ConnectForm";
import { Controller, UseFormReturn } from "react-hook-form";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { FormControl, FormHelperText } from "@mui/material";
import { Moment } from "moment";
import moment from "moment";

interface Props extends DatePickerProps<Moment> {
  name: string;
  error?: string;
  label: string;
  defaultValue?: Moment;
  required?: boolean;
}

const FormDatePicker = React.forwardRef<DatePickerProps<Moment>, Props>(
  (
    {
      name,
      error,
      minDate,
      maxDate,
      label,
      defaultValue,
      required = true,
      ...props
    },
    ref
  ) => (
    <ConnectForm>
      {({ control, formState: { errors } }: UseFormReturn) => {
        return (
          <FormControl error={errors[name]?.message !== undefined} fullWidth>
            <Controller
              control={control}
              name={name}
              defaultValue={defaultValue}
              render={({ field }) => {
                const { value, ...rest } = field;
                let inputValue = null;
                if (value) {
                  inputValue = moment(value as string);
                }
                return (
                  <DatePicker
                    slotProps={{
                      textField: {
                        size: "small",
                        required: required,
                      },
                    }}
                    format='DD - MM - YYYY'
                    minDate={minDate ? moment(minDate) : undefined}
                    maxDate={maxDate ? moment(maxDate) : undefined}
                    value={inputValue}
                    className='w-full'
                    {...rest}
                    label={label}
                    // {...props}
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
