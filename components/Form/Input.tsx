import React from "react";
import ConnectForm from "./ConnectForm";
import { UseFormReturn } from "react-hook-form";

type Props = {
  name: string;
  type?: "password" | "text";
  placeholder: string;
  autofocus?: boolean;
  label?: string;
};

export default function FormInput({
  name,
  type = "text",
  autofocus = false,
  placeholder,
  label,
}: Props) {
  const [value, setValue] = React.useState<string>();
  return (
    <ConnectForm>
      {({ register }: UseFormReturn) => (
        <>
          <label htmlFor={name}>{label}</label>
          <input
            {...register(name)}
            className='p-1.5 pl-3 pr-3 w-full border rounded-sm'
            type={type}
            id={name}
            name={name}
            autoFocus={autofocus}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
          />
        </>
      )}
    </ConnectForm>
  );
}
