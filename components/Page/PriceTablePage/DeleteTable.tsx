import { deletePriceTableAPI } from "@/api/price";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"));
import { DELETE_MESSAGE } from "@/constant/message";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-toastify";
import { PriceTable } from "@/types/price.type";
import ActionButton from "@/components/ActionButton";

type Props = {
  successCallBack: any;
  table: PriceTable;
};
export default function DeleteTable({ successCallBack, table }: Props) {
  const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);
  const {
    mutateAsync: deleteTablePriceAsync,
    isPending: isDeletingTablePrice,
  } = useMutation({
    mutationKey: ["/delete-table-price"],
    mutationFn: deletePriceTableAPI,
  });

  const handleDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenDeleteConfirmDialog(true);
  };

  const handleDeleteTablePrice = async () => {
    try {
      await deleteTablePriceAsync(table.id, {
        onSuccess: () => {
          successCallBack();
          toast.success(DELETE_MESSAGE);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDeleteConfirmDialog(false);
  };

  return (
    <>
      {openDeleteConfirmDialog && (
        <AlertDialog
          open={openDeleteConfirmDialog}
          onCancel={handleCloseDialog}
          onOpenChange={handleCloseDialog}
          title={`Delete Table ${table.name} ?`}
          content='This action cannot be reverted'
          onConfirm={handleDeleteTablePrice}
          disabled={isDeletingTablePrice}
        />
      )}
      <ActionButton variant='danger' onClick={handleDeleteButtonClick}>
        Delete
      </ActionButton>
    </>
  );
}
