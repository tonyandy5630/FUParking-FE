import { ListCardResponse } from "@/types/card.type";
import { Button } from "@mui/material";
import Modal from "@/components/modal/modal";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { activeAndDeactiveCardAPI } from "@/api/card";
import { toast } from "react-toastify";

export default function ActiveAndDeactiveCard({
  id,
  setIsPending,
  disable,
  refetch,
  isActive,
}: {
  id: string;
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<AxiosResponse<ListCardResponse, any>, Error>
  >;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => {
    setIsOpen(false);
  };

  const ActiveAndDeactiveCardMutation = useMutation({
    mutationKey: ["/cards/activeAndDeactive"],
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      activeAndDeactiveCardAPI(id, isActive),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const onClick = async () => {
    try {
      await ActiveAndDeactiveCardMutation.mutateAsync(
        { id: id, isActive: !isActive },
        {
          onSuccess: () => {
            refetch();
            setIsPending(false);
            toast.success(
              `Card ${isActive ? "deactivated" : "activated"} successfully`
            );
          },
          onError: () => {
            setIsPending(false);
            refetch();
            toast.error(
              `Failed to ${isActive ? "deactivate" : "activate"} card`
            );
          },
        }
      );
    } catch (error) {
      setIsPending(false);
      refetch();
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        disabled={disable}
        size="small"
        variant="outlined"
        color="error"
      >
        {isActive ? "Deactive" : "Active"}
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
            Are you sure want to {isActive ? "deactive" : "active"} this card?
            <div className="flex flex-row gap-5 justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setIsPending(true);
                  refetch();
                  setIsOpen(false);
                  onClick();
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
    </div>
  );
}
