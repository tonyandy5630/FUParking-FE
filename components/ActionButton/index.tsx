import { Button } from "@mui/material";
import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "danger";
}

const ActionButton = React.forwardRef<HTMLButtonElement, Props>(
  ({ variant, onClick, disabled, children, ...props }, ref) => {
    return (
      <Button
        sx={{
          backgroundColor: `${variant === "primary" ? "#3b82f6" : "#ef4444"}`,
          color: "white",
          minWidth: "80px",
          "&:disabled": {
            backgroundColor: "grey",
            color: "white",
          },
          "&:hover": {
            backgroundColor: `${variant === "primary" ? "#2563eb" : "#dc2626"}`,
          },
        }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
