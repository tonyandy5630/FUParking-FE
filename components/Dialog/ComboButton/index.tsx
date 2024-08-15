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
  const [confirmBox, setConfirmBox] = useState<{
    open: boolean;
    title: string;
    content?: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    content: "",
    onConfirm: () => {},
  });

  const handleResetClick = () => {
    setConfirmBox((prev) => ({
      open: true,
      title: "Reset",
      content: "Click OK will reset the form",
      onConfirm: onReset,
    }));
  };

  const handleCancelConfirmBox = () => {
    setConfirmBox((prev) => ({ ...prev, open: false }));
  };

  const handleCancelClick = () => {
    setConfirmBox((prev) => ({
      open: true,
      title: "Cancel",
      content: "Click OK will reset and cancel the form",
      onConfirm: onClose,
    }));
  };

  return (
    <>
      <AlertDialog
        open={confirmBox.open}
        onOpenChange={handleCancelConfirmBox}
        onCancel={handleCancelConfirmBox}
        onConfirm={confirmBox.onConfirm}
        title={confirmBox.title}
        content={confirmBox.content}
      />
      <Button
        type='button'
        onClick={handleCancelClick}
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
        onClick={handleResetClick}
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
