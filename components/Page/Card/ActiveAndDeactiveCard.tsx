import { ListCardResponse } from "@/types/card.type";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
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
            setIsOpen(false);
          },
          onError: () => {
            setIsPending(false);
            refetch();
            toast.error(
              `Failed to ${isActive ? "deactivate" : "activate"} card`
            );
            setIsOpen(false);
          },
        }
      );
    } catch (error) {
      setIsPending(false);
      refetch();
      setIsOpen(false);
    }
  };

  return (
    <div>
      {isActive ? (
        <Button
          variant="outlined"
          size="small"
          color="error"
          disabled={disable}
          onClick={() => setIsOpen(true)}
        >
          Deactivate
        </Button>
      ) : (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          disabled={disable}
          onClick={() => setIsOpen(true)}
        >
          Activate
        </Button>
      )}
      <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <Typography variant="h6">
              Are you sure you want to{" "}
              {isActive ? <>inactivate</> : <>activate</>} this card?
            </Typography>
          </DialogContent>
          <DialogActions className="flex justify-end mt-5 gap-1">
            {isActive ? (
              <Button
                variant="outlined"
                color="error"
                onClick={onClick}
                disabled={false}
              >
                Deactivate
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="error"
                onClick={onClick}
                disabled={false}
              >
                Activate
              </Button>
            )}
            <Button variant="outlined" onClick={handleClose} disabled={false}>
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Modal>
    </div>
  );
}
