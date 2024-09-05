import { deleteUserAPI } from "@/api/user";
import Modal from "@/components/modal/modal";
import { Button } from "@mui/material";
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
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-row">
            <p>Are you sure you want to delete this user?</p>
            <div className="flex gap-4">
              <Button
                onClick={onSubmit}
                disabled={isPending}
                variant="contained"
                color="primary"
              >
                Yes
              </Button>
              <Button
                onClick={handleClose}
                disabled={isPending}
                variant="contained"
                color="error"
              >
                No
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
