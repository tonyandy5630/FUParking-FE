import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { VehicleProps } from "@/types/vehicle.type";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UpdateVehicleSchema, {
  UpdateVehicleSchemaType,
} from "@/utils/schemas/updateVehicleSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateVehicleAPI } from "@/api/vehicle";
import { toast } from "react-toastify";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import ComboFormButton from "@/components/Dialog/ComboButton";
import Grid from "@mui/material/Unstable_Grid2";
import { DialogContentText } from "@mui/material";

interface Props extends DialogProps {
  vehicle: VehicleProps;
}

export default function EditVehicleDialog({
  open,
  onOpenChange,
  vehicle,
}: Props) {
  const {
    data: vehicleTypesData,
    isLoading: isLoadingVehicleTypes,
    isSuccess: isSuccessVehicleTypes,
  } = useQuery({
    queryKey: ["/update-vehicle-get-vehicle-type"],
    queryFn: getAllVehicleTypeAPI,
  });

  const methods = useForm({
    resolver: yupResolver(UpdateVehicleSchema),
    defaultValues: {
      vehicleId: vehicle.id,
      vehicleTypeId: vehicle.vehicleType,
    },
  });

  const vehicleTypesOptions = useMemo(() => {
    const vehicleTypes = vehicleTypesData?.data.data;
    if (!isSuccessVehicleTypes || !vehicleTypes || vehicleTypes.length === 0) {
      return [];
    }

    return vehicleTypes.map((item) => {
      const option: FormOptions = {
        name: item.name,
        value: item.id,
      };

      return option;
    });
  }, [vehicleTypesData?.data.data?.length]);

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { mutateAsync: updateMutationAsync, isPending } = useMutation({
    mutationKey: ["/update-vehicle"],
    mutationFn: updateVehicleAPI,
  });

  const handleUpdateVehicle = async (data: UpdateVehicleSchemaType) => {
    try {
      await updateMutationAsync(data, {
        onSuccess: (res) => {
          toast.success("Update successfully");
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseUpdate = () => {
    onOpenChange();
  };

  return (
    <>
      <Dialog open={open} maxWidth='xs'>
        <DialogTitle>
          {" "}
          Update Vehicle With Plate Number : {vehicle.plateNumber}
        </DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleUpdateVehicle)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}></Grid>
                <Grid xs={12}>
                  <FormSelect
                    name='vehicleTypeId'
                    label='Vehicle Type'
                    options={vehicleTypesOptions}
                  />
                </Grid>
                <Grid xs={12}>
                  <DialogActions className='flex justify-end min-w-full'>
                    <ComboFormButton
                      onClose={handleCloseUpdate}
                      onReset={() => reset()}
                      submitLabel='Update'
                      isLoading={isPending}
                    />
                  </DialogActions>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
