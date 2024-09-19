import { Button, ButtonProps, Radio, RadioProps } from "@mui/material";
import React from "react";

const sx = {
  minWidth: "5rem",
};
const CheckedButton = (props: ButtonProps) => (
  <Button variant='contained' sx={{ ...sx }}>
    {props.children}
  </Button>
);

interface Props extends RadioProps {
  label: string | React.JSX.Element;
}
export default function ParkingAreaRadio(props: Props) {
  return (
    <Radio
      disableRipple
      color='default'
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
