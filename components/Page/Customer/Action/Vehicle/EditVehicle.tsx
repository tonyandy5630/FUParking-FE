import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import { VehicleProps } from "@/types/vehicle.type";
import UpdateVehicleSchema, {
  UpdateVehicleSchemaType,
} from "@/utils/schemas/vehicle/updateVehicleSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import FormSelectSearch from "@/components/Form/SelectSearch";
import ComboFormButton from "@/components/Dialog/ComboButton";
import FormInput from "@/components/Form/Input";
import { toast } from "react-toastify";
import { updateVehicleAPI } from "@/api/vehicle";

type EditVehicleProps = DialogProps & {
  refresh: () => void;
  EditVehicleForm?: UpdateVehicleSchemaType;
};

export default function EditVehicle({
  open,
  onClose,
  onOpenChange,
  EditVehicleForm,
  refresh,
}: EditVehicleProps) {
  const methods = useForm({
    resolver: yupResolver(UpdateVehicleSchema),
    defaultValues: {
      vehicleId: EditVehicleForm?.vehicleId,
      vehicleTypeId: EditVehicleForm?.vehicleTypeId,
      plateNumber: EditVehicleForm?.plateNumber,
    },
  });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleClose = () => {
    const { isDirty, dirtyFields } = methods.formState;
    if (isDirty && dirtyFields) {
      setShowConfirmDialog(true);
    } else {
      onClose && onClose();
    }
  };
  const {
    reset,
    handleSubmit,
    resetField,
    setError,
    setFocus,
    formState,
    control,
  } = methods;

  const { mutateAsync: updateVehicleAsync } = useMutation({
    mutationKey: ["/vehicles/update"],
    mutationFn: updateVehicleAPI,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["/vehicles/type"],
    queryFn: () => getAllVehicleTypeAPI(),
  });
  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleUpdateVehicle = async (data: UpdateVehicleSchemaType) => {
    try {
      await updateVehicleAsync(data, {
        onSuccess: (res) => {
          toast.success("Update successfully");
          refresh();
          onOpenChange();
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <div className="flex justify-end">
            <Button
              sx={{
                position: "absolute",
                padding: "0",
                margin: "10px",
                width: "0",
                right: "0",
                top: "0",
                color: "black",
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </Button>
          </div>
          <DialogTitle>Update vehicle information</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleUpdateVehicle)}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Grid item xs={12}>
                  <FormInput
                    name={"plateNumber"}
                    label="Plate Number"
                    disabled={isLoading}
                    defaultValue={EditVehicleForm?.plateNumber}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelectSearch
                    name={"vehicleTypeId"}
                    label="Vehicle Type"
                    options={
                      isLoading
                        ? [{ name: "Loading...", value: "" }]
                        : data?.data?.data?.map((item) => ({
                            name: item.name,
                            value: item.id,
                          })) || []
                    }
                    disabled={isLoading}
                    defaultValue={EditVehicleForm?.vehicleTypeId}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DialogActions>
                    <ComboFormButton
                      submitLabel="Create"
                      onClose={onOpenChange}
                      onReset={reset}
                      isLoading={false}
                    />
                  </DialogActions>
                </Grid>
              </DialogContent>
            </form>
          </FormProvider>
        </div>
      </Modal>
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>Confirm Close</DialogTitle>
        <DialogContent>
          Are you sure you want to close the form? Unsaved changes will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmClose} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
