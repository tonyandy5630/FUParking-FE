import React, { useState } from "react";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { addParkingAreaAPI } from "@/api/parkingArea";
import { toast } from "react-toastify";
import FormInput from "@/components/Form/Input";
import Grid from "@mui/material/Unstable_Grid2";
import FormSelect from "@/components/Form/Select";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { OBJECT_EXISTED_MESSAGE } from "@/constant/message";
import { MODES } from "@/utils/mode";
import Modal from "@/components/modal/modal";
import AddParkingAreaSchema, {
  AddParkingAreaSchemaType,
} from "@/utils/schemas/parkingArea/addParkingAreaSchema";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

function AddParkingAreaDialog({ open, onOpenChange, onClose }: DialogProps) {
  const methods = useForm({
    resolver: yupResolver(AddParkingAreaSchema),
  });

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
  const [registerGate, setRegisterGate] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "gates",
  });
  const handleRegisterGateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterGate(event.target.checked);
    if (event.target.checked) {
      replace([{ name: "", description: "" }]);
    } else {
      resetField("gates");
    }
  };

  const { mutateAsync: addParkingAreaAsync, isPending } = useMutation({
    mutationKey: ["/add-parking-area"],
    mutationFn: addParkingAreaAPI,
  });

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

  const handleAddParkingArea = async (data: AddParkingAreaSchemaType) => {
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
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <DialogTitle>Create New Parking Area</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAddParkingArea)}>
            <DialogContent
              sx={{
                maxHeight: "70vh",
                width: "30vw",
              }}
            >
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className="min-w-full">
                    <FormInput
                      name="name"
                      autoFocus={true}
                      label="Parking Area Name"
                      placeholder="Enter parking area name"
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <FormInput
                    name="description"
                    multiline={true}
                    label="Description"
                    minRow={3}
                    placeholder="Enter Description"
                  />
                </Grid>
                <Grid xs={6}>
                  <div className="min-w-full">
                    <FormInput
                      name="maxCapacity"
                      type="number"
                      label="Estimate Maximum Capacity"
                      placeholder="Enter Maximum Capacity"
                    />
                  </div>
                </Grid>
                <Grid xs={6}>
                  <div className="min-w-full">
                    <FormSelect name="mode" label="Mode" options={MODES} />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <div className="min-w-full">
                    <FormInput
                      name="block"
                      type="number"
                      label="Block"
                      placeholder="Enter Block"
                      endAdornment="Minutes"
                      positive={true}
                      minLength={10}
                      maxLength={100000}
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={registerGate}
                        onChange={handleRegisterGateChange}
                      />
                    }
                    label="Register Gate"
                  />
                </Grid>
                {registerGate && (
                  <>
                    {fields.map((field, index) => (
                      <Grid
                        xs={12}
                        container
                        alignItems={"center"}
                        key={field.id}
                        component={"div"}
                      >
                        <Grid xs={1.5}>
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
                                  name: "",
                                  description: "",
                                })
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          )}
                        </Grid>
                        <Grid xs={10.5} container spacing={1}>
                          <Grid xs={12}>
                            <FormInput
                              name={`gates[${index}].name`}
                              label="Gate Name"
                              placeholder="Enter gate name"
                            />
                          </Grid>
                          <Grid xs={12}>
                            <FormInput
                              name={`gates[${index}].description`}
                              label="Description"
                              placeholder="Enter Description"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  </>
                )}
                <DialogActions className="flex justify-end min-w-full">
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

export default AddParkingAreaDialog;
