import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";

interface Props extends DialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
}
export default function AlertDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onOpenChange}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogActions>
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
