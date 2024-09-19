import { Button, ButtonProps, Radio, RadioProps } from "@mui/material";
import React from "react";

const sx = {
  minWidth: "5rem",
  height: "2rem",
};
const CheckedButton = (props: ButtonProps) => (
  <Button variant='contained' sx={{ ...sx }}>
    {props.children}
  </Button>
);

interface Props extends RadioProps {
  label: string | React.JSX.Element;
}
export default function ButtonRadio(props: Props) {
  return (
    <Radio
      disableRipple
      color='default'
      sx={{
        padding: 0,
      }}
      checkedIcon={<CheckedButton>{props.label}</CheckedButton>}
      icon={
        <Button variant='outlined' sx={{ ...sx }}>
          {props.label}
        </Button>
      }
      {...props}
    />
  );
}
