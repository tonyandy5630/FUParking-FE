import { updateStatusUserAPI } from "@/api/user";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import { User } from "@/types/user.type";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";

type DeactivateAndActiveUserProps = DialogProps & {
  User: User | undefined;
  refetch: () => void;
};

export default function DeactivateAndActiveUser({
  open,
  onClose,
  onOpenChange,
  User,
  refetch,
}: DeactivateAndActiveUserProps) {
  const handleClose = () => {
    onClose && onClose();
  };

  const changeStatusUserMutation = useMutation({
    mutationKey: ["/status-user-change"],
    mutationFn: updateStatusUserAPI,
  });

  const handleUserStatusChange = async (UserData: {
    id: string;
    isActive: boolean;
  }) => {
    if (!UserData.id) {
      return;
    }
    if (UserData.isActive === undefined) {
      return;
    }
    try {
      await changeStatusUserMutation.mutateAsync(UserData, {
        onSuccess: (res) => {
          refetch();
          toast.success("User status changed successfully");
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
          <div className="flex justify-end">
            <Button
              sx={{
                position: "absolute",
                padding: "0",
                margin: "10px",
                width: "0",
                right: "0",
                top: "0",
                color: "black",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </Button>
          </div>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change this price plan?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined" color="info">
              Cancel
            </Button>
            {User?.status === "ACTIVE" ? (
              <Button
                onClick={() =>
                  handleUserStatusChange({
                    id: User.id,
                    isActive: false,
                  })
                }
                variant="outlined"
                color="error"
              >
                Deactivate
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleUserStatusChange({
                    id: User?.id || "",
                    isActive: true,
                  })
                }
                variant="outlined"
                color="success"
              >
                Activate
              </Button>
            )}
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
