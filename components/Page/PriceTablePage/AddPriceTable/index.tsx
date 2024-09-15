import React, { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PriceTableTableSchema, {
  PriceTableTableSchemaType,
} from "@/utils/schemas/priceTableSchema";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import FormInput from "@/components/Form/Input";
import FormDatePicker from "@/components/Form/DatePicker";
import { createTableAPI } from "@/api/price";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { PRIORITY_EXISTED } from "@/constant/message";
import moment from "moment";

type Props = {
  open: boolean;
  onClose: any;
};

export default function AddPriceTable({ open, onClose }: Props) {
  const methods = useForm({ resolver: yupResolver(PriceTableTableSchema) });
  const {
    setFocus,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
    getValues,
  } = methods;

  const createTableMutation = useMutation({
    mutationKey: ["/create-table"],
    mutationFn: createTableAPI,
  });

  const {
    data: vehicleTypesData,
    isSuccess: isTypesSuccess,
    isLoading: isTypesLoading,
  } = useQuery({
    queryKey: ["/price-table/get-all-vehicle-types"],
    queryFn: getAllVehicleTypeAPI,
  });

  const handleClose = () => {
    onClose();
  };

  const vehicleTypeOptions: FormOptions[] = useMemo(() => {
    if (isTypesSuccess) {
      const types = vehicleTypesData.data.data;
      if (types) {
        return types.map((item) => {
          return {
            name: item.name,
            value: item.id,
          };
        });
      }
    }

    return [];
  }, [isTypesSuccess, vehicleTypesData]);

  const handleAddPriceTable = async (data: PriceTableTableSchemaType) => {
    try {
      await createTableMutation.mutateAsync(data, {
        onSuccess: (res) => {
          toast.success("Create table successfully");
          reset();
        },
        onError: (err: any) => {
          if (err.response.data.message === PRIORITY_EXISTED) {
            setFocus("priority");
            setError("priority", {
              message: "Priority existed",
              type: "validate",
            });
          }
        },
      });
    } catch (error) {}
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs'>
      <DialogTitle>Add New Price Table</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleAddPriceTable)}>
          <DialogContent className='min-w-fit'>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <div className='min-w-full'>
                  <FormInput
                    name='name'
                    autoFocus={true}
                    label='Table name'
                    placeholder='Table name'
                  />
                </div>
              </Grid>
              <Grid xs={6}>
                <FormSelect
                  name='vehicleTypeId'
                  options={vehicleTypeOptions}
                  label='Vehicle Types'
                  error={errors.vehicleTypeId?.message}
                />
              </Grid>
              <Grid xs={6}>
                <div className='w-full'>
                  <FormInput
                    label='Priority'
                    name='priority'
                    type='number'
                    placeholder='Priority'
                  />
                </div>
              </Grid>
              <Grid xs={6}>
                <FormDatePicker
                  minDate={moment()}
                  name='applyFromDate'
                  label='Apply From'
                  error={errors.applyFromDate?.message}
                />
              </Grid>
              <Grid xs={6}>
                <FormDatePicker
                  name='applyToDate'
                  label='Apply To'
                  minDate={moment()}
                  error={errors.applyToDate?.message}
                />
              </Grid>
              <Grid xs={12}>
                <div className='min-w-full'>
                  <FormInput
                    label='Price per Block'
                    name='pricePerBlock'
                    placeholder='Price per Block'
                    type='number'
                    endAdornment='VND'
                  />
                </div>
              </Grid>
              <Grid xs={6}>
                <div className='min-w-full'>
                  <FormInput
                    name='minPrice'
                    label='Min Price'
                    placeholder='Min Price'
                    type='number'
                    endAdornment='VND'
                  />
                </div>
              </Grid>
              <Grid xs={6}>
                <div className='min-w-full'>
                  <FormInput
                    name='maxPrice'
                    label='Max Price'
                    placeholder='Max Price'
                    type='number'
                    endAdornment='VND'
                  />
                </div>
              </Grid>

              <DialogActions className='flex justify-end min-w-full'>
                <ComboFormButton
                  onClose={handleClose}
                  onReset={() => reset()}
                  submitLabel='Create'
                  isLoading={createTableMutation.isPending}
                />
              </DialogActions>
            </Grid>
          </DialogContent>
        </form>
      </FormProvider>
    </Dialog>
  );
}
