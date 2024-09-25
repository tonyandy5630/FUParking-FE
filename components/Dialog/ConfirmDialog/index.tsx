import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { Typography } from "@mui/material";

interface Props extends DialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  content?: any;
  disabled?: boolean;
}
export default function AlertDialog({
  open,
  onOpenChange,
  title,
  onConfirm,
  onCancel,
  content,
  disabled,
}: Props) {
  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onOpenChange();
    onConfirm();
  };
  return (
    <React.Fragment>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.stopPropagation();
          onOpenChange();
        }}
      >
        <div className="p-5 flex flex-col">
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h6">{title}</Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>{content}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="error"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              autoFocus
              disabled={disabled}
              variant="outlined"
            >
              Ok
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </React.Fragment>
  );
}
