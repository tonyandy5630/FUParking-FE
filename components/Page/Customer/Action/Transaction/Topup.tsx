import { topupAPI } from "@/api/transaction";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import TopUpSchema from "@/utils/schemas/transaction/topupSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import FormInput from "@/components/Form/Input";
import ComboFormButton from "@/components/Dialog/ComboButton";

type TopupProps = DialogProps & {
  customerId: string;
  refresh: () => void;
};

export default function Topup({
  open,
  onClose,
  onOpenChange,
  customerId,
  refresh,
}: TopupProps) {
  const methods = useForm({
    resolver: yupResolver(TopUpSchema),
    defaultValues: {
      customerId: customerId,
      amount: 0,
    },
  });

  const { mutateAsync: topupAsync } = useMutation({
    mutationKey: ["/customer/topup"],
    mutationFn: topupAPI,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleClose = () => {
    const { isDirty, dirtyFields } = methods.formState;
    if (isDirty && dirtyFields) {
      setShowConfirmDialog(true);
    } else {
      onClose && onClose();
    }
  };
  const {
    reset,
    handleSubmit,
    resetField,
    setError,
    setFocus,
    formState,
    control,
  } = methods;

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleTopup = async (data: any) => {
    try {
      await topupAsync(data, {
        onSuccess: () => {
          refresh();
          toast.success("Topup successfully");
          onOpenChange();
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <div className="flex justify-end">
            <Button
              sx={{
                position: "absolute",
                padding: "0",
                margin: "10px",
                width: "0",
                right: "0",
                top: "0",
                color: "black",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </Button>
          </div>
          <DialogTitle>Topup customer</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleTopup)}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Grid item xs={12} className="hidden">
                  <FormInput
                    label="Customer ID"
                    name="customerId"
                    defaultValue={customerId}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    label="Amount"
                    name="amount"
                    type="number"
                    positive={true}
                    min={100}
                    maxNumber={1000000}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogActions>
                    <ComboFormButton
                      submitLabel="Topup"
                      onClose={onOpenChange}
                      onReset={reset}
                      isLoading={false}
                    />
                  </DialogActions>
                </Grid>
              </DialogContent>
            </form>
          </FormProvider>
        </div>
      </Modal>
    </>
  );
}
