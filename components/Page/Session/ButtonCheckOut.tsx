import { checkOutAPI, paymentAPI } from "@/api/session";
import Modal from "@/components/modal/modal";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from "../LoadingPage/Loading";

export default function ButtonCheckOut({
  plateNumber,
  timeOut,
  setIsOpen,
  isOpen,
  cardNumber,
}: {
  plateNumber: string;
  timeOut: string;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  cardNumber: string;
}) {
  const handleClickButton = () => {
    setIsOpen(true);
  };
  const [isPending, setIsPending] = useState(false);
  const [typeOfCustomer, setTypeOfCustomer] = useState<string | null>(null);
  const [moneyNeedToPay, setMoneyNeedToPay] = useState<number | null>(null);
  const [imageIn, setImageIn] = useState<string | null>(null);
  const closeSession = useMutation({
    mutationKey: ["/session/close"],
    mutationFn: (data: { plateNumber: string; timeOut: string }) =>
      checkOutAPI(data),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const paymentSession = useMutation({
    mutationKey: ["/session/payment"],
    mutationFn: () => paymentAPI(cardNumber),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async (data: { plateNumber: string; timeOut: string }) => {
    try {
      await closeSession.mutateAsync(data, {
        onSuccess: (data) => {
          setIsPending(false);
          setTypeOfCustomer(data.data.data?.typeOfCustomer as string);
          setMoneyNeedToPay(data.data.data?.amount as number);
          setImageIn(data.data.data?.imageIn as string);
        },
        onError: (error) => {
          toast.error("Failed to get data");
          setIsPending(false);
        },
      });
    } catch (error) {
      toast.error("Failed to get data");
    }
  };

  const handlePayment = async () => {
    try {
      await paymentSession.mutateAsync(undefined, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          setIsOpen(false);
        },
        onError: (error) => {
          toast.error("Failed to pay");
          setIsPending(false);
        },
      });
    } catch (error) {
      toast.error("Failed to pay");
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          handleClickButton();
          onSubmit({ timeOut, plateNumber });
        }}
        variant="contained"
        color="primary"
      >
        Check Out
      </Button>
      <Modal open={isOpen} setOpen={setIsOpen}>
        <div className="pl-5 pr-5 pt-10 pb-10">
          {isPending ? (
            <Loading />
          ) : (
            <>
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
              <div>
                <p>Session Parking Location: {plateNumber}</p>
                <p>Session Image In:</p>
                {imageIn && (
                  <Image
                    loader={() => imageIn}
                    src={imageIn}
                    alt="session image in"
                    width="200"
                    height="200"
                    className="rounded-lg"
                  />
                )}
                <p>Type of Customer: {typeOfCustomer ?? "N/A"}</p>
                <p>Money Need to Pay: {moneyNeedToPay ?? "N/A"}</p>
              </div>
              <Button
                onClick={handlePayment}
                variant="contained"
                color="primary"
              >
                Payment
              </Button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
