import React from "react";

type Props = {
  children: any;
  variant: "success" | "warning" | "error";
};
export default function Chip({ children, variant = "success" }: Props) {
  return (
    <span
      className='p-1 pl-2 pr-2 rounded-xl inline-block w-fit text-center'
      style={{
        color:
          variant === "success"
            ? "#62a34f"
            : variant === "warning"
            ? "#ed6c02"
            : "black",
        backgroundColor:
          variant === "success"
            ? "#dcfce7"
            : variant === "warning"
            ? "#fef9c3"
            : "white",
      }}
    >
      {children}
    </span>
  );
}
