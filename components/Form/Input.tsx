import React, { lazy, forwardRef } from "react";
import ConnectForm from "./ConnectForm";
import { UseFormReturn } from "react-hook-form";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
const InputAdornment = lazy(() => import("@mui/material/InputAdornment"));
import TextField from "@mui/material/TextField";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type?: "password" | "text" | "number";
  label?: string;
  endAdornment?: any;
  error?: string;
  multiline?: boolean;
  minRow?: number;
}

const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      name,
      type = "text",
      label,
      defaultValue,
      error,
      placeholder,
      endAdornment,
      multiline,
      minRow,
      ...props
    },
    ref
  ) => {
    return (
      <ConnectForm>
        {({ register, formState: { errors } }: UseFormReturn) => {
          return (
            <FormControl
              error={errors[name]?.message !== undefined || error !== undefined}
              fullWidth
            >
              <TextField
                {...register(name)}
                error={errors[name]?.message !== undefined}
                className='w-full border rounded-sm'
                size='small'
                type={type}
                id={name}
                label={label}
                multiline={multiline}
                minRows={multiline ? minRow : undefined}
                name={name}
                autoFocus={props.autoFocus}
                placeholder={placeholder}
                inputRef={ref}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  defaultValue: defaultValue,
                  endAdornment: endAdornment ? (
                    <InputAdornment position='end'>
                      {endAdornment}
                    </InputAdornment>
                  ) : (
                    <></>
                  ),
                }}
              />
              <FormHelperText>
                {(errors[name]?.message as string) ?? error}
              </FormHelperText>
            </FormControl>
          );
        }}
      </ConnectForm>
    );
  }
);
FormInput.displayName = "FormInput";
export default React.memo(FormInput);
