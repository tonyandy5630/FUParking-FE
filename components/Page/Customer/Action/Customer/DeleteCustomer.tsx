import Modal from "@/components/modal/modal";
import { Button, DialogContent, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
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
            >
              <CloseIcon onClick={handleClose} className="cursor-pointer" />
            </Button>
          </div>
          <DialogContent>
            <div className="text-center">
              <Typography variant="h6">
                Are you sure to delete this customer?
              </Typography>
            </div>
            <div className="flex justify-center mt-5 gap-5">
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
            </div>
          </DialogContent>
        </div>
      </Modal>
    </>
  );
}
