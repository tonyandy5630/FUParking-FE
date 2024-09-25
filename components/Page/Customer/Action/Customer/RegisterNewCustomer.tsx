import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import NewCustomerSchema from "@/utils/schemas/customer/newCustomerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  DialogActions,
  Grid,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle as MuiDialogTitle,
  DialogContent as MuiDialogContent,
  DialogActions as MuiDialogActions,
  Button,
  IconButton,
  Divider,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormInput from "@/components/Form/Input";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { useState } from "react";
import FormSelectSearch from "@/components/Form/SelectSearch";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createCustomerNonPaidAPI } from "@/api/customer";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function RegisterNewCustomer({
  open,
  onClose,
  onOpenChange,
}: DialogProps) {
  const methods = useForm({ resolver: yupResolver(NewCustomerSchema) });
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

  const [registerVehicle, setRegisterVehicle] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "vehicles",
  });

  const handleRegisterVehicleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterVehicle(event.target.checked);
    if (event.target.checked) {
      replace([{ plateNumber: "", vehicleTypeId: "" }]);
    } else {
      resetField("vehicles");
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["/vehicles/type"],
    queryFn: () => getAllVehicleTypeAPI(),
  });

  const { mutateAsync: createCustomerAsync, isPending } = useMutation({
    mutationKey: ["/customer/nonpaid"],
    mutationFn: createCustomerNonPaidAPI,
  });

  const handleCreateCustomer = async (formData: any) => {
    const customerData = {
      name: formData.name,
      email: formData.email,
      vehicles: registerVehicle ? formData.vehicles : [],
    };

    try {
      await createCustomerAsync(customerData, {
        onSuccess(data, variables, context) {
          onOpenChange();
        },
      });
    } catch (error: any) {
      if (error.response?.data?.message === "This email is already exist") {
        setError("email", {
          type: "validate",
          message: "This email is already exist",
        });
        setFocus("email");
      }
    }
  };

  const handleClose = () => {
    if (isDirty && Object.keys(dirtyFields).length > 0) {
      setShowConfirmDialog(true);
    } else {
      onClose && onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  return (
    <>
      <Modal open={open} setOpen={onOpenChange} onClose={handleClose}>
        <div className="p-5 flex flex-col">
          <DialogTitle>Register non-paid customer</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleCreateCustomer)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormInput
                      name="name"
                      label="Name"
                      placeholder="Enter name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput
                      name="email"
                      label="Email"
                      placeholder="Enter email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={registerVehicle}
                          onChange={handleRegisterVehicleChange}
                        />
                      }
                      label="Register Vehicle"
                    />
                  </Grid>
                  {registerVehicle && (
                    <>
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
                    </>
                  )}
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
