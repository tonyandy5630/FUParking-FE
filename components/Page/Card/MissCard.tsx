import { deleteCardAPI, missingCardAPI } from "@/api/card";
import Modal from "@/components/modal/modal";
import { ListCardResponse } from "@/types/card.type";
import { Button } from "@mui/material";
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
        <div className="pl-5 pr-5 pt-10 pb-10">
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              padding: "0",
              margin: "10px",
              width: "0",
              right: "0",
              top: "0",
              color: "black",
              border: "1px solid black",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            X
          </Button>
          <div className="flex flex-col w-full space-y-5 gap-5">
            Are you sure want to change status this card to Missing this card?
            <div className="flex flex-row gap-5 justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setIsPending(true);
                  refetch();
                  setIsOpen(false);
                  onMissing();
                }}
              >
                Yes
              </Button>
              <Button variant="contained" color="primary" onClick={handleClose}>
                No
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
