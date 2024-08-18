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
import { addParkingAreaAPI, updateParkingAreaAPI } from "@/api/parkingArea";
import { toast } from "react-toastify";
import FormInput from "@/components/Form/Input";
import Grid from "@mui/material/Unstable_Grid2";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { OBJECT_EXISTED_MESSAGE } from "@/constant/message";
import { ParkingAreas } from "@/types/parkingArea.type";
import { MODES } from "@/utils/mode";

interface Props extends DialogProps {
  /**
   * true is Add, false is Update
   */
}

function AddParkingAreaDialog({ open, onOpenChange, onClose }: Props) {
  const methods = useForm({
    resolver: yupResolver(ParkingAreaSchema),
  });

  const {
    formState: { errors },
    reset,
    handleSubmit,
    setError,
  } = methods;
  const { mutateAsync: addParkingAreaAsync, isPending } = useMutation({
    mutationKey: ["/add-parking-area"],
    mutationFn: addParkingAreaAPI,
  });

  const handleClose = () => {
    onOpenChange();
  };

  const handleAddParkingArea = async (data: ParkingAreaSchemaType) => {
    try {
      await addParkingAreaAsync(data, {
        onSuccess: (res) => {
          toast.success("Add Parking Area Successfully");
          reset();
        },
      });
    } catch (error: any) {
      if (error.response.data.message === OBJECT_EXISTED_MESSAGE) {
        setError("name", {
          type: "validate",
          message: "Parking Area Name taken",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs'>
      <DialogTitle>Create New Parking Area</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleAddParkingArea)}>
          <DialogContent className='min-w-fit'>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <div className='min-w-full'>
                  <FormInput
                    name='name'
                    autoFocus={true}
                    label='Parking Area Name'
                    placeholder='Enter parking area name'
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
                />
              </Grid>
              <Grid xs={6}>
                <div className='min-w-full'>
                  <FormInput
                    name='maxCapacity'
                    type='number'
                    label='Estimate Maximum Capacity'
                    placeholder='Enter Maximum Capacity'
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
                  />
                </div>
              </Grid>
              <DialogActions className='flex justify-end min-w-full'>
                <ComboFormButton
                  onClose={handleClose}
                  onReset={reset}
                  submitLabel={"Create"}
                  isLoading={isPending}
                />
              </DialogActions>
            </Grid>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default AddParkingAreaDialog;
