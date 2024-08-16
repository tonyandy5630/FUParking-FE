import { cancelSessionAPI } from "@/api/session";
import Modal from "@/components/modal/modal";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../LoadingPage/Loading";
import CheckCircle from "@/public/CheckCircle.svg";
import Image from "next/image";

export default function ButtonCancelSession({
  sessionId,
  setIsOpen,
  isOpen,
}: {
  sessionId: string;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}) {
  const handleClickButton = () => {
    setIsOpen(true);
  };
  const [isPending, setIsPending] = useState(false);

  const cancelSession = useMutation({
    mutationKey: ["/session/cancel"],
    mutationFn: () => cancelSessionAPI(sessionId),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async () => {
    try {
      await cancelSession.mutateAsync(undefined, {
        onSuccess: (data) => {
          setIsPending(false);
          toast.success("Session canceled successfully");
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to cancel session");
          setIsPending(false);
        },
      });
    } catch (error) {
      toast.error("Failed to cancel session");
      setIsPending(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          handleClickButton();
          () => {
            setIsOpen(true);
          };
        }}
        variant="contained"
        color="primary"
      >
        CANCEL SESSION
      </Button>
      <Modal open={isOpen} setOpen={setIsOpen}>
        <div className="flex flex-col gap-5 p-5">
          {isPending ? (
            <Loading />
          ) : cancelSession.isSuccess ? (
            <div className="flex flex-row gap-3 justify-center">
              <Image
                src={CheckCircle}
                alt="Check Circle"
                height={50}
                width={50}
              />
              <p>Session canceled successfully</p>
              <Button
                onClick={() => {
                  setIsOpen(false);
                }}
                variant="contained"
                color="primary"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <div className="flex flex-row gap-3 justify-center">
                <p>Are you sure you want to cancel this session?</p>
              </div>
              <div className="flex flex-row gap-3 items-center justify-center w-full">
                <Button
                  onClick={() => {
                    onSubmit();
                  }}
                  variant="contained"
                  color="primary"
                >
                  Confirm
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  variant="contained"
                  color="primary"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
