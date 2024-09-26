import { deleteParkingAreaAPI } from "@/api/parkingArea";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

type DeleteParkingAreaProps = DialogProps & {
  parkingAreaId: string;
  refresh: () => void;
};

export default function DeleteParkingArea({
  open,
  onClose,
  onOpenChange,
  parkingAreaId,
  refresh,
}: DeleteParkingAreaProps) {
  const { mutateAsync: deleteParkingAreaAsync } = useMutation({
    mutationKey: ["/parking-area/delete"],
    mutationFn: deleteParkingAreaAPI,
  });

  const handleDelete = async () => {
    try {
      await deleteParkingAreaAsync(parkingAreaId, {
        onSuccess: () => {
          refresh();
          onOpenChange();
          toast.success("Delete parking area successfully");
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
            <DialogContentText>
              Are you sure you want to delete this parking area?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
