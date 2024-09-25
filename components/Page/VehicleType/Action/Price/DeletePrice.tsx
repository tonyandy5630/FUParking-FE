import { deletePriceTableAPI } from "@/api/price";
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

type DeletePriceProps = DialogProps & {
  priceTableId: string;
  refetch: () => void;
};

export default function DeletePriceTable({
  open,
  onClose,
  onOpenChange,
  priceTableId,
  refetch,
}: DeletePriceProps) {
  const { mutateAsync: deletePriceTableAsync } = useMutation({
    mutationKey: ["/price/delete"],
    mutationFn: deletePriceTableAPI,
  });

  const handleDelete = async () => {
    try {
      await deletePriceTableAsync(priceTableId, {
        onSuccess: () => {
          refetch();
          onOpenChange();
          toast.success("Delete price table successfully");
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
              Are you sure to delete this price plan?
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
