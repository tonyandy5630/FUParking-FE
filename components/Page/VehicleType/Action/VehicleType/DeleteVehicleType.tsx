import { deleteVehicleTypeAPI } from "@/api/vehicleType";
import { DialogProps } from "@/types/dialog.type";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Modal from "@/components/modal/modal";
import { toast } from "react-toastify";
import { on } from "events";

type DeleteVehicleTypeProps = DialogProps & {
  id: string;
  refetch: () => void;
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
};

export default function DeleteVehicleType({
  id,
  refetch,
  setIsPending,
  disable,
  open,
  onClose,
  onOpenChange,
}: DeleteVehicleTypeProps) {
  const deleteVehicleTypeMutation = useMutation({
    mutationKey: ["/types"],
    mutationFn: (id: string) => deleteVehicleTypeAPI(id),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const onDelete = async () => {
    try {
      await deleteVehicleTypeMutation.mutateAsync(id, {
        onSuccess: (data) => {
          toast.success("Vehicle type deleted successfully");
          refetch();
          setIsPending(false);
          onOpenChange();
        },
      });
    } catch (error) {
      setIsPending(false);
      toast.error("Failed to delete vehicle type");
      onOpenChange();
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <Typography variant="h6">
              Are you sure to delete this vehicle type?
            </Typography>
          </DialogContent>
          <DialogActions className="flex justify-end gap-1">
            <Button
              variant="outlined"
              color="error"
              onClick={onDelete}
              disabled={false}
            >
              Delete
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={false}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
