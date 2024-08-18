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
  content?: string;
}
export default function AlertDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  onCancel,
  content,
}: Props) {
  const handleConfirm = () => {
    onOpenChange();
    onConfirm();
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
