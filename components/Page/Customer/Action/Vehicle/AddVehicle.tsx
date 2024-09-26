import { createVehicleForCustomerByUserAPI } from "@/api/vehicle";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import NewVehicleSchema from "@/utils/schemas/vehicle/createVehicleSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import {
  DialogActions,
  Grid,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Button,
  IconButton,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import ComboFormButton from "@/components/Dialog/ComboButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FormInput from "@/components/Form/Input";
import FormSelectSearch from "@/components/Form/SelectSearch";
import { toast } from "react-toastify";

type AddVehicleProps = DialogProps & {
  customerId: string;
  refresh: () => void; // Add refresh callback
};

export default function AddVehicle({
  open,
  onClose,
  onOpenChange,
  customerId,
  refresh,
}: AddVehicleProps) {
  const methods = useForm({
    resolver: yupResolver(NewVehicleSchema),
    defaultValues: {
      vehicles: [{ plateNumber: "", vehicleTypeId: "" }],
    },
  });

  const handleClose = () => {
    if (isDirty && Object.keys(dirtyFields).length > 0) {
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
  const { isDirty, dirtyFields } = formState;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "vehicles",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["/vehicles/type"],
    queryFn: () => getAllVehicleTypeAPI(),
  });

  const { mutateAsync: createVehicleAsync } = useMutation({
    mutationKey: ["/vehicles/create"],
    mutationFn: createVehicleForCustomerByUserAPI,
  });

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleCreateVehicle = async (formData: any) => {
    const vehicleData = {
      customerId: customerId,
      vehicles: formData.vehicles,
    };
    try {
      await createVehicleAsync(vehicleData, {
        onSuccess: (data, variables, context) => {
          onOpenChange();
          refresh();
          toast.success("Vehicle created successfully");
        },
      });
    } catch (error: any) {
      if (error.response) {
        const { data } = error.response;
        if (data?.error) {
          setError("vehicles", {
            type: "manual",
            message: data.error,
          });
          setFocus("vehicles");
        }
      }
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogTitle>Register vehicle</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleCreateVehicle)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={1}>
                  {fields.map((field, index) => (
                    <Grid
                      item
                      xs={12}
                      container
                      alignItems={"center"}
                      key={field.id}
                    >
                      <Grid item xs={1.5}>
                        {index > 0 ? (
                          <IconButton
                            color="secondary"
                            onClick={() => remove(index)}
                          >
                            <RemoveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            color="primary"
                            onClick={() =>
                              append({
                                plateNumber: "",
                                vehicleTypeId: "",
                              })
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item xs={10.5} container spacing={1}>
                        <Grid item xs={12}>
                          <FormInput
                            name={`vehicles[${index}].plateNumber`}
                            label="Plate Number"
                            placeholder="Enter plate number"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormSelectSearch
                            name={`vehicles[${index}].vehicleTypeId`}
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
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}

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
        <MuiDialogTitle>Confirm Close</MuiDialogTitle>
        <MuiDialogContent>
          Are you sure you want to close the form? Unsaved changes will be lost.
        </MuiDialogContent>
        <MuiDialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmClose} color="primary">
            Confirm
          </Button>
        </MuiDialogActions>
      </Dialog>
    </>
  );
}
