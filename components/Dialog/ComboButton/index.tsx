import { Button } from "@mui/material";
import React, { lazy, useState } from "react";
const AlertDialog = lazy(() => import("../ConfirmDialog"));

type Props = {
  onClose: () => void;
  onReset: () => void;
  isLoading?: boolean;
  submitLabel: string;
};

export default function ComboFormButton({
  onClose,
  onReset,
  isLoading,
  submitLabel,
}: Props) {
  const [openConfirmBox, setOpenConfirmBox] = useState(false);

  const handleOpenConfirmBoxChange = () => {
    onReset();
    setOpenConfirmBox((prev) => !prev);
  };

  const handleCancelConfirmBox = () => {
    setOpenConfirmBox((prev) => !prev);
  };

  return (
    <>
      <AlertDialog
        open={openConfirmBox}
        onOpenChange={handleCancelConfirmBox}
        onCancel={handleCancelConfirmBox}
        onConfirm={handleOpenConfirmBoxChange}
        title='Confirm reset?'
      />
      <Button
        type='button'
        onClick={onClose}
        color='error'
        variant='outlined'
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button
        type='button'
        variant='contained'
        color='warning'
        onClick={handleOpenConfirmBoxChange}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Reset"}
      </Button>
      <Button type='submit' variant='contained' disabled={isLoading}>
        {isLoading ? "Loading..." : submitLabel}
      </Button>
    </>
  );
}
