import { deleteGateAPI } from "@/api/gate";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

type DeletGateProps = DialogProps & {
  gateId: string;
  refresh: () => void;
};

export default function DeleteGate({
  open,
  onClose,
  onOpenChange,
  gateId,
  refresh,
}: DeletGateProps) {
  const { mutateAsync: deleteGateAsync } = useMutation({
    mutationKey: ["/gate/delete"],
    mutationFn: deleteGateAPI,
  });

  const handleDelete = async () => {
    try {
      await deleteGateAsync(gateId, {
        onSuccess: () => {
          refresh();
          onOpenChange();
          toast.success("Delete gate successfully");
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <Typography variant="h6">
              Are you sure you want to delete this gate?
            </Typography>
          </DialogContent>
          <DialogActions className="flex justify-end gap-1">
            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={false}
            >
              Delete
            </Button>
            <Button variant="outlined" onClick={handleClose} disabled={false}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
