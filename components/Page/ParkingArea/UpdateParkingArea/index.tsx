import React from "react";
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
import { updateParkingAreaAPI } from "@/api/parkingArea";
import { toast } from "react-toastify";
import FormInput from "@/components/Form/Input";
import Grid from "@mui/material/Unstable_Grid2";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { ParkingAreas } from "@/types/parkingArea.type";
import { MODES } from "@/utils/mode";

interface Props extends DialogProps {
  value: ParkingAreas;
}

function UpdateParkingAreaDialog({
  open,
  onOpenChange,
  onClose,
  value,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(ParkingAreaSchema),
  });

  const {
    formState: { errors },
    reset,
    handleSubmit,
    getValues,
  } = methods;

  const {
    mutateAsync: updateParkingAreaAsync,
    isPending: isPendingUpdateParkingArea,
  } = useMutation({
    mutationKey: ["/update-parking-area"],
    mutationFn: updateParkingAreaAPI,
  });

  const handleClose = () => {
    onOpenChange();
  };

  const handleUpdateParkingArea = async (data: ParkingAreaSchemaType) => {
    try {
      const updateData = {
        data,
        id: value.id,
      };
      await updateParkingAreaAsync(updateData, {
        onSuccess: (res) => {
          toast.success("Update Successfully");
        },
      });
    } catch (error) {}
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs'>
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
                    options={MODES}
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
              <DialogActions className='flex justify-end min-w-full'>
                <ComboFormButton
                  onClose={handleClose}
                  onReset={reset}
                  submitLabel='Update'
                  isLoading={isPendingUpdateParkingArea}
                />
              </DialogActions>
            </Grid>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default UpdateParkingAreaDialog;
