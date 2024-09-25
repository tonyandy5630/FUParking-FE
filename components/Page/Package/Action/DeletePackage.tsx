import { deletePackageAPI } from "@/api/package";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

type DeletePackageProps = DialogProps & {
  id: string;
  refetch: () => void;
};

export default function DeletePackage({
  open,
  id,
  onOpenChange,
  refetch,
  onClose,
}: DeletePackageProps) {
  const { mutateAsync: deletePackageAsync } = useMutation({
    mutationKey: ["/package/delete"],
    mutationFn: deletePackageAPI,
  });

  const handleDelete = async () => {
    try {
      await deletePackageAsync(id, {
        onSuccess: () => {
          refetch();
          toast.success("Delete package successfully");
          onOpenChange();
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
              Are you sure to delete this package?
            </Typography>
          </DialogContent>
          <DialogActions className="flex justify-end gap-5">
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
