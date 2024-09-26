import { updatePriceTableStatusAPI } from "@/api/price";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import { PriceTable } from "@/types/price.type";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

type InactiveAndActivePriceProps = DialogProps & {
  priceTable: PriceTable | undefined;
  refetch: () => void;
};

export default function InactiveAndActivePrice({
  open,
  onClose,
  onOpenChange,
  priceTable,
  refetch,
}: InactiveAndActivePriceProps) {
  const handleClose = () => {
    onClose && onClose();
  };

  const changeStatusPriceTableMutation = useMutation({
    mutationKey: ["/status-price-table-change"],
    mutationFn: updatePriceTableStatusAPI,
  });

  const handlePriceTableStatusChange = async (priceTableData: {
    priceTableId: string;
    isActive: boolean;
  }) => {
    if (!priceTableData.priceTableId) {
      return;
    }
    if (priceTableData.isActive === undefined) {
      return;
    }
    try {
      await changeStatusPriceTableMutation.mutateAsync(priceTableData, {
        onSuccess: (res) => {
          refetch();
          toast.success("Price plan status changed successfully");
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
            <Typography variant="h6">
              Are you sure you want to change this price plan?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            {priceTable?.statusPriceTable === "ACTIVE" ? (
              <Button
                onClick={() =>
                  handlePriceTableStatusChange({
                    priceTableId: priceTable.id,
                    isActive: false,
                  })
                }
                variant="outlined"
                color="error"
              >
                Inactive
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handlePriceTableStatusChange({
                    priceTableId: priceTable?.id || "",
                    isActive: true,
                  })
                }
                variant="outlined"
                color="success"
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
