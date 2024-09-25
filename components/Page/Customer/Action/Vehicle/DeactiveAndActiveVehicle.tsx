import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { changeVehicleStatusAPI } from "@/api/vehicle";
import { toast } from "react-toastify";

type DeactiveAndActiveVehicleProps = DialogProps & {
  vehicleId: string;
  refresh: () => void;
  status: string;
};

export default function DeactiveAndActiveVehicle({
  open,
  onClose,
  onOpenChange,
  vehicleId,
  refresh,
  status,
}: DeactiveAndActiveVehicleProps) {
  const handleClose = () => {
    onClose && onClose();
  };

  const vehicleStatusChangeMutation = useMutation({
    mutationKey: ["/status-vehicle-change"],
    mutationFn: changeVehicleStatusAPI,
  });

  const handleVehicleStatusChange = async (vehicleData: {
    vehicleId: string;
    isActive: boolean;
  }) => {
    if (!vehicleData.vehicleId) {
      return;
    }
    if (vehicleData.isActive === undefined) {
      return;
    }
    try {
      await vehicleStatusChangeMutation.mutateAsync(vehicleData, {
        onSuccess: (res) => {
          toast.success("Update successfully");
          refresh();
          onOpenChange();
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <DialogContentText>
              <Typography variant="h6">
                Are you sure you want to change this vehicle?
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            {status === "ACTIVE" ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  refresh();
                  handleVehicleStatusChange({
                    vehicleId: vehicleId,
                    isActive: false,
                  });
                }}
              >
                Deactive
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  refresh();
                  handleVehicleStatusChange({
                    vehicleId: vehicleId,
                    isActive: true,
                  });
                }}
              >
                Active
              </Button>
            )}
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
