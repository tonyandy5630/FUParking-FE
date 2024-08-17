import { deleteCardAPI } from "@/api/card";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import { ListCardResponse } from "@/types/card.type";
import { Button } from "@mui/material";
import {
  RefetchOptions,
  QueryObserverResult,
  useMutation,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function DeleteCard({
  id,
  refetch,
  setIsPending,
  disable,
}: {
  id: string;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<AxiosResponse<ListCardResponse, any>, Error>
  >;
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
}) {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const deleteCardMutation = useMutation({
    mutationKey: ["/cards"],
    mutationFn: (cardId: string) => deleteCardAPI(cardId),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const handleToggleDialog = () => {
    console.log(true);
    setOpenConfirmDialog((prev) => !prev);
  };

  const handleConfirmDialog = () => {
    handleToggleDialog();
  };

  const onDelete = async () => {
    try {
      await deleteCardMutation.mutateAsync(id, {
        onSuccess: () => {
          toast.success("Card deleted successfully");
          refetch();
          setIsPending(false);
        },
      });
    } catch (error) {
      setIsPending(false);
      refetch();
    }
  };

  return (
    <>
      <AlertDialog
        onCancel={handleToggleDialog}
        onConfirm={() => {
          onDelete();
        }}
        onOpenChange={handleToggleDialog}
        open={openConfirmDialog}
        title='Delete this card ?'
        content='Click OK will DELETE this card'
      />
      <Button
        sx={{
          backgroundColor: "#ef4444",
          color: "white",
          width: "80px",
          "&:disabled": {
            backgroundColor: "grey",
            color: "white",
          },
          "&:hover": {
            backgroundColor: "#dc2626",
          },
        }}
        disabled={disable}
        onClick={handleConfirmDialog}
      >
        Delete
      </Button>
    </>
  );
}
