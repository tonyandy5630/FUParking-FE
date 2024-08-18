import { DialogProps } from "@/types/dialog.type";
import React, { useMemo, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@tanstack/react-query";
import { addPackageAPI, updatePackageAPI } from "@/api/package";
import PackageSchema, {
  PackageSchemaType,
  UpdatePackageSchema,
  UpdatePackageSchemaType,
} from "@/utils/schemas/PackageSchema";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useHandleDialog from "@/hook/useHandleDialog";
import Grid from "@mui/material/Unstable_Grid2";
import FormInput from "@/components/Form/Input";
import ComboFormButton from "@/components/Dialog/ComboButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import { OBJECT_EXISTED_MESSAGE } from "@/constant/message";
import { Button } from "@mui/material";
import { expDurationIncrement } from "../PackageTable";
import incrementValue from "@/utils/increment";
import { Packages } from "@/types/package.type";

interface Props extends DialogProps {
  successCallback: () => void;
  value: Packages;
}

export default function UpdatePackageDialog({
  open,
  onOpenChange,
  onClose,
  successCallback,
  value,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(UpdatePackageSchema),
    defaultValues: {
      isActive: value.packageStatus === "INACTIVE" ? false : true,
      packageId: value.id,
    },
  });
  const {
    reset,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    setFocus,
    getValues,
  } = methods;
  const {
    openDialog: openConfirmDialog,
    handleOpenDialog: handleOpenConfirmDialog,
    handleCloseDialog: handleCloseConfirmDialog,
  } = useHandleDialog(false);

  const { mutateAsync: updatePackageAsync, isPending } = useMutation({
    mutationKey: ["/add-package"],
    mutationFn: updatePackageAPI,
  });

  const handleConfirmDialog = () => {
    handleCloseConfirmDialog();
    reset();
    if (onClose) onClose();
  };

  const handleCloseUpdateDialog = () => {
    handleOpenConfirmDialog();
  };

  const handleUpdatePackage = async (data: UpdatePackageSchemaType) => {
    try {
      await updatePackageAsync(data, {
        onSuccess(data) {
          toast.success("Add package successfully");
          successCallback();
        },
      });
    } catch (error: any) {
      if (error.response.data.message === OBJECT_EXISTED_MESSAGE) {
        setError("name", {
          type: "validate",
          message: "Package name is existed",
        });
        setFocus("name");
      }
    }
  };

  return (
    <>
      <AlertDialog
        open={openConfirmDialog}
        onCancel={handleCloseConfirmDialog}
        onConfirm={handleConfirmDialog}
        title='Confirm cancel Update Package?'
        content='Click OK will CLOSE and RESET the form'
        onOpenChange={handleCloseConfirmDialog}
      />
      <Dialog open={open} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Package</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleUpdatePackage)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='name'
                      label='Package Name'
                      placeholder='Enter package name'
                      defaultValue={value.name}
                    />
                  </div>
                </Grid>
              </Grid>
              <DialogActions>
                <ComboFormButton
                  submitLabel='Create'
                  isLoading={isPending}
                  onClose={handleConfirmDialog}
                  onReset={reset}
                />
              </DialogActions>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
