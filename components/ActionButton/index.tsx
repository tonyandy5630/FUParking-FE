import { Button, ButtonProps } from "@mui/material";
import React from "react";

interface Props extends ButtonProps {}

const ActionButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ onClick, disabled, children, ...props }, ref) => {
    return (
      <Button
        size="small"
        onClick={onClick}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
