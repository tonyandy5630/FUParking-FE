import { deleteCardAPI, missingCardAPI } from "@/api/card";
import Modal from "@/components/modal/modal";
import { ListCardResponse } from "@/types/card.type";
import {
  Button,
  DialogContent,
  Typography,
  DialogActions,
} from "@mui/material";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function MissCard({
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
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  const missCardMutation = useMutation({
    mutationKey: ["/cards"],
    mutationFn: (cardId: string) => missingCardAPI(cardId),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const onMissing = async () => {
    try {
      await missCardMutation.mutateAsync(id, {
        onSuccess: () => {
          toast.success("Change card successfully");
          refetch();
          setIsPending(false);
        },
        onError: () => {
          toast.error("Failed to change card");
          setIsPending(false);
          refetch();
        },
      });
    } catch (error) {
      toast.error("Failed to change card");
      setIsPending(false);
      refetch();
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="error"
        disabled={disable}
        onClick={() => setIsOpen(true)}
        size="small"
      >
        Missing
      </Button>
      <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <Typography variant="h6">
              Are you sure you want to change status this card?
            </Typography>
          </DialogContent>
          <DialogActions className="flex justify-end mt-5 gap-1">
            <Button
              variant="outlined"
              color="error"
              onClick={onMissing}
              disabled={false}
            >
              MISSING
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
