import { DialogProps } from "@/types/dialog.type";
import React, { useMemo, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@tanstack/react-query";
import { addPackageAPI } from "@/api/package";
import PackageSchema, {
  PackageSchemaType,
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

interface Props extends DialogProps {
  successCallback: () => void;
}

export default function AddPackageDialog({
  open,
  onOpenChange,
  onClose,
  successCallback,
}: Props) {
  const methods = useForm({ resolver: yupResolver(PackageSchema) });
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

  const { mutateAsync: addPackageAsync, isPending } = useMutation({
    mutationKey: ["/add-package"],
    mutationFn: addPackageAPI,
  });

  const handleConfirmDialog = () => {
    handleCloseConfirmDialog();
    reset();
    onOpenChange();
  };

  const handleCloseAddDialog = () => {
    handleOpenConfirmDialog();
  };

  const handleIncrementClick = (value: number) => {
    const exp = getValues("expPackage");
    const newExp = incrementValue(exp, value);
    setValue("expPackage", newExp);
  };
  const incrementButtons = useMemo(() => {
    return expDurationIncrement.map((item) => (
      <Button
        className='!min-w-10'
        key={item}
        onClick={() => handleIncrementClick(item)}
      >
        +{item}
      </Button>
    ));
  }, [expDurationIncrement.length]);

  const handleAddPackage = async (data: PackageSchemaType) => {
    try {
      await addPackageAsync(data, {
        onSuccess(data, variables, context) {
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
        title='Confirm cancel Create new Package?'
        content='Click OK will CLOSE and RESET the form'
        onOpenChange={handleCloseConfirmDialog}
      />
      <Dialog open={open} onClose={handleCloseAddDialog}>
        <DialogTitle>Add new Package</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAddPackage)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='name'
                      label='Package Name'
                      placeholder='Enter package name'
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className='min-w-full'>
                    <FormInput
                      type='number'
                      name='coinAmount'
                      label='Package Coin Amount'
                      placeholder='Enter coin amount'
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className='min-w-full'>
                    <FormInput
                      type='number'
                      name='extraCoin'
                      label='Extra coin package'
                      placeholder='Enter extra coin'
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className='min-w-full'>
                    <FormInput
                      name='expPackage'
                      label='Extra coin duration'
                      placeholder='Enter extra coin duration'
                      endAdornment='Days'
                    />
                  </div>

                  {incrementButtons}
                </Grid>
                <Grid xs={6}>
                  <div className='min-w-full'>
                    <FormInput
                      type='number'
                      name='price'
                      label='Price'
                      placeholder='Enter price'
                      endAdornment='VND'
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
