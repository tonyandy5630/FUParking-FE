import { deleteUserAPI } from "@/api/user";
import Modal from "@/components/modal/modal";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Delete({
  userId,
  setIsOpen,
  isOpen,
}: {
  userId: string;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  const [isPending, setIsPending] = useState(false);

  const DeleteUser = useMutation({
    mutationKey: ["/user/delete"],
    mutationFn: () => deleteUserAPI(userId),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async () => {
    try {
      await DeleteUser.mutateAsync(undefined, {
        onSuccess: (data) => {
          setIsPending(false);
          toast.success("User deleted successfully");
          setIsOpen(false);
        },
        onError: (error) => {
          setIsPending(false);
        },
      });
    } catch (error) {
      setIsPending(false);
    }
  };
  return (
    <>
      <Modal open={isOpen} onClose={handleClose} setOpen={setIsOpen}>
        <div className="p-5 flex flex-col">
          <DialogContent>
            <Typography variant="h6">
              Are you sure you want to delete this user?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={onSubmit}
              disabled={isPending}
              variant="outlined"
              color="error"
            >
              Delete
            </Button>
            <Button
              onClick={handleClose}
              disabled={isPending}
              variant="outlined"
              color="primary"
            >
              Cancel
            </Button>
          </DialogActions>
        </div>
      </Modal>
    </>
  );
}
