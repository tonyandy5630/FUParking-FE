import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { Moment } from "moment";
import React from "react";

interface Props extends DatePickerProps<Moment> {
  onValueChange: (value: Moment | null) => void;
}
export default function CustomDatePicker({ onValueChange, ...props }: Props) {
  return (
    <DatePicker
      className='w-44'
      label={props.label}
      value={props.value}
      onChange={(e) => onValueChange(e)}
      slotProps={{
        textField: {
          size: "small",
          InputLabelProps: { shrink: true },
        },
        field: {
          clearable: true,
          onClear: () => {
            onValueChange(null);
          },
        },
      }}
      minDate={props.minDate}
      maxDate={props.maxDate}
      format='DD/MM/YYYY'
    />
  );
}
