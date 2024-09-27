import { checkOutAPI, getPaymentPlateNumberAPI } from "@/api/session";
import Modal from "@/components/modal/modal";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loading from "../LoadingPage/Loading";

export default function ButtonCheckOut({
  plateNumber,
  checkOutTime,
  setIsOpen,
  isOpen,
  cardNumber,
}: {
  plateNumber: string;
  checkOutTime: string;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  cardNumber: string;
}) {
  const handleClickButton = () => {
    setIsOpen(true);
  };

  const checkOutSession = useMutation({
    mutationKey: ["/session/close"],
    mutationFn: (data: { PlateNumber: string; CheckOutTime: string }) =>
      checkOutAPI(data),
  });

  const { data: paymentData, isPending: isPaymentPending } = useQuery({
    queryKey: ["/session/payment"],
    queryFn: () => getPaymentPlateNumberAPI(plateNumber, checkOutTime),
  });

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async (data: {
    PlateNumber: string;
    CheckOutTime: string;
  }) => {
    console.log(data);
    try {
      await checkOutSession.mutateAsync(data, {
        onSuccess: (data) => {
          setIsOpen(false);
          toast.success("Check out successfully");
        },
        onError: (error) => {
          toast.error("Failed to get data");
          setIsOpen(false);
        },
      });
    } catch (error) {
      toast.error("Failed to get data");
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          handleClickButton();
        }}
        variant="contained"
        color="primary"
      >
        Check Out
      </Button>
      <Modal open={isOpen} setOpen={setIsOpen}>
        {isPaymentPending ? (
          <Loading />
        ) : (
          <div className="p-5 flex flex-col">
            <DialogContent>
              <Typography variant="h6">
                The amount of money you need to pay is:{" "}
                {paymentData?.data.data.amount} VND
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} variant="outlined">
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() =>
                  onSubmit({
                    PlateNumber: plateNumber,
                    CheckOutTime: checkOutTime,
                  })
                }
              >
                Check Out
              </Button>
            </DialogActions>
          </div>
        )}
      </Modal>
    </>
  );
}
