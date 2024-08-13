import React, { useEffect, useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PriceTableTableSchema, {
  PriceTableTableSchemaType,
} from "@/utils/schemas/priceTableSchema";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import { useQuery } from "@tanstack/react-query";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import { Button } from "@mui/material";
import FormInput from "@/components/Form/Input";

type Props = {
  open: boolean;
  onOpenChange: any;
};

export default function AddPriceTable({ open, onOpenChange }: Props) {
  const methods = useForm({ resolver: yupResolver(PriceTableTableSchema) });
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
    getValues,
  } = methods;

  const {
    data: vehicleTypesData,
    isSuccess: isTypesSuccess,
    isLoading: isTypesLoading,
  } = useQuery({
    queryKey: ["/price-table/get-all-vehicle-types"],
    queryFn: getAllVehicleTypeAPI,
  });

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
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogTitle>Add New Price Table</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleAddPriceTable)}>
          <DialogContent className='min-w-fit'>
            <Grid container spacing={2}>
              <Grid xs={12}>
                <div className='min-w-full'>
                  <FormInput name='name' placeholder='Enter table name' />
                </div>
              </Grid>
              <Grid xs={6}>
                <FormSelect
                  name='vehicleTypeId'
                  options={vehicleTypeOptions}
                  label='Vehicle Types'
                />
              </Grid>
              <Grid xs={6}>
                <div className='w-full'>
                  <FormInput
                    name='priority'
                    type='number'
                    placeholder='Enter priority'
                  />
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type='submit'>Create</Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
