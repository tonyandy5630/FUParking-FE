import { DialogProps } from "@/types/dialog.type";
import { PriceTable } from "@/types/price.type";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
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
      id: table.id,
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
      handleToggleConfirmDialog();
      return;
    }
    //* close confirm dialog + close edit form
    handleCloseConfirm();
    props.onOpenChange();
  };

  const handleCloseEditDialog = () => {
    //* closed edit dialog with out confirm
    if (!isDirty) {
      props.onOpenChange();
      return;
    }
    handleOpenConfirmDialog();
  };

  return (
    <>
      {openConfirmDialog && (
        <AlertDialog
          open={openConfirmDialog}
          title='Cancel'
          onOpenChange={props.onOpenChange}
          onCancel={handleCloseConfirmDialog}
          onConfirm={handleCloseConfirmDialog}
          content='This action cannot be reverted'
          onClose={handleCloseConfirmDialog}
        />
      )}
      <Dialog
        maxWidth='xs'
        open={props.open}
        onClose={handleCloseConfirmDialog}
      >
        <DialogTitle>{`Update Table ${table.name}`}</DialogTitle>
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEdit)}>
              <FormInput name='name' autoFocus defaultValue={table.name} />
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions>
          <ComboFormButton
            submitLabel='Update'
            onClose={handleCloseEditDialog}
            onReset={reset}
            isDirty={isDirty}
            isLoading={isUpdatingTable}
          />
        </DialogActions>
      </Dialog>
    </>
  );
}
