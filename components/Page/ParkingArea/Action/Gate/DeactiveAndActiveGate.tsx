import { gateStatusChangeAPI } from "@/api/gate";
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
import { useEffect } from "react";

type DeactiveAndActiveGateProps = DialogProps & {
  gateId: string;
  refresh: () => void;
  status: string;
};

export default function DeactiveAndActiveGate({
  open,
  onClose,
  onOpenChange,
  gateId,
  refresh,
  status,
}: DeactiveAndActiveGateProps) {
  const handleClose = () => {
    onClose && onClose();
  };

  useEffect(() => {
    console.log("status", status);
  }, [status]);

  const gateStatusChangeMutation = useMutation({
    mutationKey: ["/gate/status"],
    mutationFn: gateStatusChangeAPI,
  });

  const handleGateStatusChange = async (gateData: {
    gateId: string;
    isActive: boolean;
  }) => {
    if (!gateData.gateId) {
      return;
    }
    if (gateData.isActive === undefined) {
      return;
    }
    try {
      await gateStatusChangeMutation.mutateAsync(gateData, {
        onSuccess: (res) => {
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
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change status this gate?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {status === "ACTIVE" ? (
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  refresh();
                  handleGateStatusChange({
                    gateId: gateId,
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
                  handleGateStatusChange({
                    gateId: gateId,
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
