import { DialogProps } from "@/types/dialog.type";
import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GateSchema, { GateSchemaType } from "@/utils/schemas/gateSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addGateAPI, getAllGateAPI } from "@/api/gate";
import { toast } from "react-toastify";
import Grid from "@mui/material/Unstable_Grid2";
import { getAllParkingAreaAPI } from "@/api/parkingArea";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import FormInput from "@/components/Form/Input";
import FormRadioGroup from "@/components/Form/RadioGroup";
import ComboFormButton from "@/components/Dialog/ComboButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import useHandleDialog from "@/hook/useHandleDialog";

interface Props extends DialogProps {
  refetch: any;
}

export default function AddGateDialog({
  open,
  onClose,
  onOpenChange,
  refetch,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(GateSchema),
  });
  const { openDialog: openAlert, handleToggleDialog: toggleAlert } =
    useHandleDialog(false);

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { mutateAsync: addGateAsync, isPending } = useMutation({
    mutationKey: ["/add-gate"],
    mutationFn: addGateAPI,
  });

  const { data: parkingAreasData, isLoading } = useQuery({
    queryKey: ["/add-gate-parking-areas"],
    queryFn: getAllParkingAreaAPI,
  });

  const { data: gateTypesData } = useQuery({
    queryKey: ["/get-all-gate-type-add-gate"],
    queryFn: getAllGateAPI,
  });

  const parkingAreasOptions: FormOptions[] = useMemo(() => {
    const parkingAreas = parkingAreasData?.data.data;
    if (!parkingAreas || parkingAreas.length === 0) return [];

    return parkingAreas.map((item) => ({
      name: item.name,
      value: item.id,
    }));
  }, [parkingAreasData?.data.data]);

  const gateTypesOPtions: FormOptions[] = useMemo(() => {
    const gateTypes = gateTypesData?.data.data;
    if (!gateTypes) {
      return [];
    }

    return gateTypes.map((item) => ({
      name: item.name,
      value: item.id,
    }));
  }, [gateTypesData?.data.data]);

  const handleClose = () => {
    onOpenChange();
  };

  const handleConfirmCloseAddDialog = () => {
    reset();
    onOpenChange();
  };

  const handleAddGate = async (data: GateSchemaType) => {
    try {
      await addGateAsync(data, {
        onSuccess: () => {
          toast.success("Add gate Successfully");
          refetch();
        },
      });
    } catch (error) {}
  };

  return (
    <>
      <AlertDialog
        open={openAlert}
        onCancel={toggleAlert}
        onConfirm={handleConfirmCloseAddDialog}
        title='Cancel create new Gate'
        onOpenChange={toggleAlert}
      />
      <Dialog open={open} onClose={toggleAlert}>
        <DialogTitle>Add New gate</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAddGate)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='name'
                      label='Gate name'
                      placeholder='Enter gate name'
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <FormInput
                    multiline={true}
                    minRow={2}
                    name='description'
                    label='Description'
                    placeholder='Enter Description'
                  />
                </Grid>
                <Grid xs={12}>
                  <FormSelect
                    label='Parking Area'
                    options={parkingAreasOptions}
                    name='parkingAreaId'
                    error={errors.parkingAreaId?.message}
                  />
                </Grid>
                <Grid xs={12}>
                  <FormRadioGroup
                    row={true}
                    name='gateTypeId'
                    options={gateTypesOPtions}
                    label='Gate Type'
                  />
                </Grid>
              </Grid>
              <Grid>
                <DialogActions>
                  <ComboFormButton
                    onClose={handleClose}
                    onReset={reset}
                    isLoading={isPending}
                    submitLabel='Create'
                  />
                </DialogActions>
              </Grid>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
