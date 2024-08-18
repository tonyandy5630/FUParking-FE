import useHandleDialog from "@/hook/useHandleDialog";
import Button from "@mui/material/Button";
import dynamic from "next/dynamic";
import React from "react";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"));

type Props = {
  onDelete: () => void;
  children: any;
};

export default function DeleteButton({ onDelete, children }: Props) {
  const {
    openDialog: openAlertDialog,
    handleToggleDialog: handleToggleAlertDialog,
  } = useHandleDialog(false);

  const handleDeleteClick = () => {
    handleToggleAlertDialog();
  };
  return (
    <>
      {openAlertDialog && (
        <AlertDialog
          open={openAlertDialog}
          onCancel={handleToggleAlertDialog}
          onConfirm={onDelete}
          title='Delete ?'
          content={
            <div>
              <p>OK will DELETE this item</p>
              <strong>This action cannot be revert</strong>
            </div>
          }
          onClose={handleToggleAlertDialog}
          onOpenChange={handleToggleAlertDialog}
        />
      )}
      <Button color='error' variant='contained' onClick={handleDeleteClick}>
        {children}
      </Button>
    </>
  );
}
