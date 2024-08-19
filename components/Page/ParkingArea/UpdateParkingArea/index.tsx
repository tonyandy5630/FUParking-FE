import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ParkingAreaSchema, {
  ParkingAreaSchemaType,
} from "@/utils/schemas/parkingAreaSchema";
import { useMutation } from "@tanstack/react-query";
import { deleteParkingAreaAPI, updateParkingAreaAPI } from "@/api/parkingArea";
import { toast } from "react-toastify";
import FormInput from "@/components/Form/Input";
import Grid from "@mui/material/Unstable_Grid2";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { ParkingAreas } from "@/types/parkingArea.type";
import { MODES } from "@/utils/mode";
import { OBJECT_EXISTED_MESSAGE } from "@/constant/message";
import { Delete } from "@mui/icons-material";
import DialogActionWithDelete from "@/components/Dialog/ActionWithDelete";
import DeleteButton from "@/components/DeleteButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import useHandleDialog from "@/hook/useHandleDialog";

interface Props extends DialogProps {
  value: ParkingAreas;
  successCallback: () => void;
}

const MODE_OPTIONS: FormOptions[] = [...MODES];

function UpdateParkingAreaDialog({
  open,
  onOpenChange,
  onClose,
  value,
  successCallback,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(ParkingAreaSchema),
    defaultValues: {
      mode: value.mode,
      parkingAreaId: value.id,
    },
  });
  const {
    openDialog: openConfirmDialog,
    handleToggleDialog: toggleConfirmDialog,
  } = useHandleDialog(false);
  const [updateParkingArea, setUpdateParkingArea] = useState<
    ParkingAreas | undefined
  >();

  const {
    formState: { errors },
    reset,
    handleSubmit,
    setError,
  } = methods;

  const {
    mutateAsync: deleteParkingAreaAsync,
    isPending: isPendingDeleteParkingArea,
  } = useMutation({
    mutationKey: ["/delete-parking-area"],
    mutationFn: deleteParkingAreaAPI,
  });

  const {
    mutateAsync: updateParkingAreaAsync,
    isPending: isPendingUpdateParkingArea,
  } = useMutation({
    mutationKey: ["/update-parking-area"],
    mutationFn: updateParkingAreaAPI,
  });

  const handleToggleConfirmBox = () => {};

  const handleUpdateParkingAreaChange = () => {
    toggleConfirmDialog();
  };

  const handleClose = () => {
    onOpenChange();
  };

  const handleDeleteParkingArea = async () => {
    try {
      await deleteParkingAreaAsync(value.id, {
        onSuccess: () => {
          toast.success("Delete Parking Area Successfully");
          handleClose();
          successCallback();
        },
      });
    } catch (error) {}
  };

  const handleUpdateParkingArea = async (data: ParkingAreaSchemaType) => {
    try {
      await updateParkingAreaAsync(data, {
        onSuccess: (res) => {
          toast.success("Update Successfully");
          successCallback();
        },
      });
    } catch (error: any) {
      if (error.response.data.message === OBJECT_EXISTED_MESSAGE) {
        setError("name", {
          type: "validate",
          message: "Parking Area Name is existed",
        });
      }
    }
  };

  return (
    <>
      {openConfirmDialog && (
        <AlertDialog
          open={openConfirmDialog}
          onOpenChange={handleToggleConfirmBox}
          title='Cancel Update Parking Area'
          onCancel={toggleConfirmDialog}
          onConfirm={handleClose}
        />
      )}
      <Dialog open={open} onClose={toggleConfirmDialog}>
        <DialogTitle>{"Update Parking Area: " + value?.name}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleUpdateParkingArea)}>
            <DialogContent className='min-w-fit'>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='name'
                      autoFocus={true}
                      label='Parking Area Name'
                      placeholder='Enter parking area name'
                      defaultValue={value?.name}
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <FormInput
                    name='description'
                    multiline={true}
                    label='Description'
                    minRow={3}
                    placeholder='Enter Description'
                    defaultValue={value?.description}
                  />
                </Grid>
                <Grid xs={6}>
                  <div className='min-w-full'>
                    <FormInput
                      name='maxCapacity'
                      type='number'
                      label='Estimate Maximum Capacity'
                      placeholder='Enter Maximum Capacity'
                      defaultValue={value?.maxCapacity}
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className='min-w-full'>
                    <FormSelect
                      name='mode'
                      label='Mode'
                      options={MODE_OPTIONS}
                      error={errors.mode?.message}
                      defaultValue={value?.mode}
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='block'
                      type='number'
                      label='Block'
                      placeholder='Enter Block'
                      endAdornment='Minutes'
                      defaultValue={value?.block}
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <DialogActionWithDelete>
                    <DeleteButton onDelete={handleDeleteParkingArea}>
                      Delete
                    </DeleteButton>
                    <DialogActions>
                      <ComboFormButton
                        onClose={handleClose}
                        onReset={reset}
                        submitLabel='Update'
                        isLoading={isPendingUpdateParkingArea}
                      />
                    </DialogActions>
                  </DialogActionWithDelete>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}

export default UpdateParkingAreaDialog;
