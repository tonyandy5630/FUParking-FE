import { DialogProps } from "@/types/dialog.type";
import { PriceTable } from "@/types/price.type";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import { FormProvider, useForm } from "react-hook-form";
import FormInput from "@/components/Form/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  UpdatePriceTableSchema,
  UpdatePriceTableSchemaType,
} from "@/utils/schemas/priceTableSchema";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { useMutation } from "@tanstack/react-query";
import { updatePriceTableAPI } from "@/api/price";
import { toast } from "react-toastify";
import { UPDATE_SUCCEED_MESSAGE } from "@/constant/message";
import useHandleDialog from "@/hook/useHandleDialog";
import dynamic from "next/dynamic";
import FormDatePicker from "@/components/Form/DatePicker";
import moment from "moment";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"));
interface Props extends DialogProps {
  successCallback: any;
  table: PriceTable;
}
export default function EditPriceTable({
  successCallback,
  table,
  ...props
}: Props) {
  const methods = useForm({
    defaultValues: {
      priceTableId: table.id,
      applyFromDate:
        table.applyFromDate !== null
          ? new Date(moment(table.applyFromDate).toString())
          : null,
      applyToDate:
        table.applyToDate !== null
          ? new Date(moment(table.applyToDate).toString())
          : null,
    },
    resolver: yupResolver(UpdatePriceTableSchema),
  });
  const {
    handleCloseDialog: handleCloseConfirm,
    handleToggleDialog: handleToggleConfirmDialog,
    handleOpenDialog: handleOpenConfirmDialog,
    openDialog: openConfirmDialog,
  } = useHandleDialog();
  const {
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    setValue,
  } = methods;
  const { mutateAsync: updatePriceTableAsync, isPending: isUpdatingTable } =
    useMutation({
      mutationKey: ["/edit-price-table"],
      mutationFn: updatePriceTableAPI,
    });

  const handleEdit = async (body: UpdatePriceTableSchemaType) => {
    try {
      await updatePriceTableAsync(body, {
        onSuccess: () => {
          successCallback();
          reset({}, { keepValues: true });
          toast.success(UPDATE_SUCCEED_MESSAGE);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseConfirmDialog = () => {
    //*  close edit dialog with out confirm
    if (!isDirty) {
      props.onOpenChange();
      return;
    }
    //* close confirm dialog + close edit form
    handleOpenConfirmDialog();
  };

  return (
    <>
      {openConfirmDialog && (
        <AlertDialog
          open={openConfirmDialog}
          title='Close Edit Price Table'
          onOpenChange={props.onOpenChange}
          onCancel={handleCloseConfirmDialog}
          onConfirm={props.onOpenChange}
          content='This action cannot be reverted'
          onClose={handleCloseConfirmDialog}
        />
      )}
      <Dialog
        maxWidth='xs'
        disableRestoreFocus
        open={props.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{`Update Table ${table.name}`}</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEdit)}>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormInput
                    name='name'
                    autoFocus={true}
                    defaultValue={table.name}
                  />
                </Grid>
                <Grid xs={12}>
                  <FormDatePicker
                    name='applyFromDate'
                    defaultValue={
                      table.applyFromDate === null
                        ? null
                        : moment(table.applyFromDate)
                    }
                    label='Apply From'
                    error={errors.applyFromDate?.message}
                  />
                </Grid>
                <Grid xs={12}>
                  <FormDatePicker
                    name='applyToDate'
                    label='Apply To'
                    defaultValue={
                      table.applyToDate === null
                        ? null
                        : moment(table.applyToDate)
                    }
                    error={errors.applyToDate?.message}
                  />
                </Grid>
              </Grid>
              <DialogActions>
                <ComboFormButton
                  submitLabel='Update'
                  onClose={props.onOpenChange}
                  onReset={reset}
                  isDirty={isDirty}
                  isLoading={isUpdatingTable}
                />
              </DialogActions>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
