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
  endAdornment?: string;
}

const FormInput = forwardRef<HTMLInputElement, Props>(
  (
    { name, type = "text", label, placeholder, endAdornment, ...props },
    ref
  ) => {
    return (
      <ConnectForm>
        {({ register, formState: { errors } }: UseFormReturn) => (
          <FormControl error={errors[name]?.message !== undefined} fullWidth>
            <TextField
              {...register(name)}
              error={errors[name]?.message !== undefined}
              className='test-sm w-full border rounded-sm'
              size='small'
              type={type}
              id={name}
              label={label}
              name={name}
              autoFocus={props.autoFocus}
              placeholder={placeholder}
              InputProps={{
                endAdornment: endAdornment ? (
                  <InputAdornment position='end'>{endAdornment}</InputAdornment>
                ) : (
                  <></>
                ),
              }}
            />
            <FormHelperText>{errors[name]?.message as string}</FormHelperText>
          </FormControl>
        )}
      </ConnectForm>
    );
  }
);

export default FormInput;
