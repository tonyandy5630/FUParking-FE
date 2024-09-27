import { PriceTable } from "@/types/price.type";
import {
  UpdatePriceTableSchema,
  UpdatePriceTableSchemaType,
} from "@/utils/schemas/priceTableSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogProps } from "@/types/dialog.type";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updatePriceTableAPI } from "@/api/price";
import { toast } from "react-toastify";
import Modal from "@/components/modal/modal";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FormInput from "@/components/Form/Input";
import moment from "moment";
import FormDatePicker from "@/components/Form/DatePicker";
import ComboFormButton from "@/components/Dialog/ComboButton";

type UpdatePriceProps = DialogProps & {
  priceTable: PriceTable | undefined;
  refetch: () => void;
};

export default function UpdatePrice({
  open,
  onClose,
  onOpenChange,
  priceTable,
  refetch,
}: UpdatePriceProps) {
  const methods = useForm({
    defaultValues: {
      applyFromDate: priceTable?.applyFromDate
        ? moment.utc(priceTable.applyFromDate).toDate()
        : undefined,
      applyToDate: priceTable?.applyToDate
        ? moment.utc(priceTable.applyToDate).toDate()
        : undefined,
      name: priceTable?.name,
      priceTableId: priceTable?.id,
    },
    resolver: yupResolver(UpdatePriceTableSchema),
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

  const { mutateAsync: updatePriceTableAsync } = useMutation({
    mutationKey: ["/price/update"],
    mutationFn: updatePriceTableAPI,
  });

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

  const handleUpdatePrice = async (data: UpdatePriceTableSchemaType) => {
    try {
      const updatedData = {
        ...data,
        applyFromDate: moment.utc(data.applyFromDate).format(),
        applyToDate: moment.utc(data.applyToDate).format(),
      };
      await updatePriceTableAsync(data, {
        onSuccess: () => {
          refetch();
          onOpenChange();
          toast.success("Update price table successfully");
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        setOpen={onOpenChange}
        maxWidth='md'
      >
        <div className='p-5 flex flex-col'>
          <DialogTitle>Update Price Table</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleUpdatePrice)}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Grid item xs={12}>
                  <FormInput
                    name={"name"}
                    label='Name'
                    defaultValue={priceTable?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormDatePicker
                    name={"applyFromDate"}
                    label='Apply From'
                    minDate={moment.utc()}
                    required={false}
                    defaultValue={
                      priceTable?.applyFromDate
                        ? moment.utc(priceTable.applyFromDate)
                        : undefined
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormDatePicker
                    name={"applyToDate"}
                    label='Apply To'
                    minDate={moment.utc()}
                    required={false}
                    defaultValue={
                      priceTable?.applyToDate
                        ? moment.utc(priceTable.applyToDate)
                        : undefined
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogActions>
                    <ComboFormButton
                      isDirty={formState.isDirty}
                      onClose={handleClose}
                      onReset={() => reset()}
                      submitLabel='Update'
                    />
                  </DialogActions>
                </Grid>
              </DialogContent>
            </form>
          </FormProvider>
        </div>
      </Modal>
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Confirm Close</DialogTitle>
        <DialogContent>
          Are you sure you want to close the form? Unsaved changes will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmClose} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
