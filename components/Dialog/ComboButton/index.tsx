import { Button } from "@mui/material";
import React, { lazy, useState } from "react";
const AlertDialog = lazy(() => import("../ConfirmDialog"));

type Props = {
  /**
   *  Action when confirm closing the form
   * @returns
   */
  onClose: () => void;
  onReset: () => void;
  isLoading?: boolean;
  submitLabel: string;
  isDirty?: boolean;
};

export default function ComboFormButton({
  onClose,
  onReset,
  isLoading,
  submitLabel,
  isDirty,
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
    if (!isDirty) {
      return;
    }
    setConfirmBox((prev) => ({
      open: true,
      title: "Reset",
      content: "Click OK will reset the form",
      onConfirm: onReset,
    }));
  };

  const handleCancelConfirmBox = () => {
    //* close confirm
    setConfirmBox((prev) => ({ ...prev, open: false }));
  };

  const handleCancelClick = () => {
    if (!isDirty) {
      onClose();
      return;
    }
    setConfirmBox((prev) => ({
      open: true,
      title: "Cancel",
      content: "Click OK will reset and cancel the form",
      onConfirm: () => {
        onReset();
        onClose();
      },
    }));
  };

  return (
    <>
      {confirmBox.open && (
        <AlertDialog
          open={confirmBox.open}
          onOpenChange={handleCancelConfirmBox}
          onCancel={handleCancelConfirmBox}
          onConfirm={confirmBox.onConfirm}
          title={confirmBox.title}
          content={confirmBox.content}
        />
      )}
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
