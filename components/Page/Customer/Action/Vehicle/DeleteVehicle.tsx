import { deleteVehicleAPI } from "@/api/vehicle";
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

type DeleteVehicleProps = DialogProps & {
  vehicleId: string;
  refresh: () => void;
};

export default function DeleteVehicle({
  open,
  onClose,
  onOpenChange,
  vehicleId,
  refresh,
}: DeleteVehicleProps) {
  const { mutateAsync: deleteVehicleAsync } = useMutation({
    mutationKey: ["/vehicles/delete"],
    mutationFn: deleteVehicleAPI,
  });

  const handleDelete = async () => {
    try {
      await deleteVehicleAsync(vehicleId, {
        onSuccess: () => {
          refresh();
          onOpenChange();
          toast.success("Delete vehicle successfully");
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
              Are you sure you want to delete this vehicle?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
