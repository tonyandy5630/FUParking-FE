import Modal from "@/components/modal/modal";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DialogProps } from "@/types/dialog.type";
import { deleteCustomerAPI } from "@/api/customer";

type DeleteCustomerProps = DialogProps & {
  customerId: string;
  refresh: () => void;
};

export default function DeleteCustomer({
  open,
  onClose,
  onOpenChange,
  customerId,
  refresh,
}: DeleteCustomerProps) {
  const { mutateAsync: deleteCustomerAsync } = useMutation({
    mutationKey: ["/customer/delete"],
    mutationFn: deleteCustomerAPI,
  });

  const handleDelete = async () => {
    try {
      await deleteCustomerAsync(customerId, {
        onSuccess: () => {
          refresh();
          onOpenChange();
          toast.success("Delete customer successfully");
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
              Are you sure to delete this customer?
            </Typography>
          </DialogContent>
          <DialogActions className="flex justify-end mt-5 gap-1">
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
