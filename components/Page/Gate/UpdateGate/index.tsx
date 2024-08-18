import { DialogProps } from "@/types/dialog.type";
import React, { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import GateSchema, { GateSchemaType } from "@/utils/schemas/gateSchema";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addGateAPI,
  deleteGateAPI,
  getAllGateAPI,
  updateGateAPI,
} from "@/api/gate";
import { toast } from "react-toastify";
import Grid from "@mui/material/Unstable_Grid2";
import { getAllParkingAreaAPI } from "@/api/parkingArea";
import FormSelect, { FormOptions } from "@/components/Form/Select";
import FormInput from "@/components/Form/Input";
import FormRadioGroup from "@/components/Form/RadioGroup";
import ComboFormButton from "@/components/Dialog/ComboButton";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import useHandleDialog from "@/hook/useHandleDialog";
import { Gates } from "@/types/gate.type";
import { Button } from "@mui/material";
import DeleteButton from "@/components/DeleteButton";

interface Props extends DialogProps {
  value: Gates;
  refetch: any;
}

export default function UpdateGateDialogs({
  open,
  onClose,
  onOpenChange,
  value,
  refetch,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(GateSchema),
    defaultValues: {
      gateTypeId: value.gateType.id,
      parkingAreaId: value.parkingArea.id,
    },
  });
  const { openDialog: openAlert, handleToggleDialog: toggleAlert } =
    useHandleDialog(false);
  const [isDelete, setIsDelete] = useState(false);
  const {
    reset,
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;
  const { mutateAsync: updateGateAsync, isPending } = useMutation({
    mutationKey: ["/update-gate"],
    mutationFn: updateGateAPI,
  });

  const { mutateAsync: deleteGateAsync, isPending: isPendingDeleteGate } =
    useMutation({
      mutationKey: ["/delete-gate"],
      mutationFn: deleteGateAPI,
    });

  const { data: parkingAreasData, isLoading } = useQuery({
    queryKey: ["/update-gate-parking-areas"],
    queryFn: getAllParkingAreaAPI,
  });

  const { data: gateTypesData } = useQuery({
    queryKey: ["/update-all-gate-type"],
    queryFn: getAllGateAPI,
  });

  const handleDeleteGate = async () => {
    try {
      await deleteGateAsync(value.id, {
        onSuccess: () => {
          toast.success("Delete gate successfully");
          refetch();
          if (onClose) onClose();
        },
      });
    } catch (error) {}
  };

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

  const handleConfirmCloseAlertDialog = () => {
    reset();
    if (onClose) onClose();
  };
  const handleUpdateGate = async (data: GateSchemaType) => {
    try {
      const updateGateBody = {
        data,
        gateId: value.id,
      };

      await updateGateAsync(updateGateBody, {
        onSuccess: () => {
          toast.success("Update gate Successfully");
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
        onConfirm={handleConfirmCloseAlertDialog}
        title={"Cancel Update Gate " + value.name}
        onOpenChange={toggleAlert}
      />
      <Dialog open={open} onClose={toggleAlert}>
        <DialogTitle>Update gate</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleUpdateGate)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='name'
                      label='Gate name'
                      placeholder='Enter gate name'
                      defaultValue={value.name}
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
                    defaultValue={value.description}
                  />
                </Grid>
                <Grid xs={12}>
                  <FormSelect
                    label='Parking Area'
                    options={parkingAreasOptions}
                    name='parkingAreaId'
                    error={errors.parkingAreaId?.message}
                    defaultValue={value.parkingArea.id}
                  />
                </Grid>
                <Grid xs={12}>
                  <FormRadioGroup
                    name='gateTypeId'
                    options={gateTypesOPtions}
                    label='Gate Type'
                    row={true}
                    defaultValue={value.gateType.id}
                  />
                </Grid>
              </Grid>
              <Grid>
                <div className='min-w-full flex justify-between items-center'>
                  <DeleteButton onDelete={handleDeleteGate}>
                    Delete
                  </DeleteButton>
                  <DialogActions>
                    <ComboFormButton
                      onClose={handleClose}
                      onReset={reset}
                      isLoading={isPending}
                      submitLabel='Update'
                    />
                  </DialogActions>
                </div>
              </Grid>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
