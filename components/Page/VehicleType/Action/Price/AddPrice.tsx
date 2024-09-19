import React, { useMemo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PriceTableTableSchema, {
  PriceTableTableSchemaType,
} from "@/utils/schemas/priceTableSchema";
import { getAllVehicleTypeAPI } from "@/api/vehicleType";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormInput from "@/components/Form/Input";
import FormDatePicker from "@/components/Form/DatePicker";
import { createTableAPI } from "@/api/price";
import { toast } from "react-toastify";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { PRIORITY_EXISTED } from "@/constant/message";
import moment from "moment";
import { DialogProps } from "@/types/dialog.type";
import Modal from "@/components/modal/modal";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { Checkbox } from "@mui/material";

type Props = DialogProps & {
  VehicleTypeId: string | null;
  refetch: () => void;
};

export default function AddPriceTable({
  open,
  onClose,
  onOpenChange,
  VehicleTypeId,
  refetch,
}: Props) {
  const methods = useForm({ resolver: yupResolver(PriceTableTableSchema) });
  const {
    setFocus,
    handleSubmit,
    reset,
    control,
    setError,
    formState,
    getValues,
  } = methods;

  const { isDirty, dirtyFields } = formState;

  const [registerPriceItem, setRegisterPriceItem] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "priceItems",
  });

  const handleRegisterPriceItemChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRegisterPriceItem(event.target.checked);
    if (event.target.checked) {
      append({
        blockPricing: 0,
        from: 0,
        to: 0,
        maxPrice: 0,
        minPrice: 0,
      });
    } else {
      reset({ priceItems: [] });
    }
  };

  const createTableMutation = useMutation({
    mutationKey: ["/create-table"],
    mutationFn: createTableAPI,
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

  const handleAddPriceTable = async (data: PriceTableTableSchemaType) => {
    try {
      await createTableMutation.mutateAsync(data, {
        onSuccess: (res) => {
          toast.success("Create table successfully");
          reset();
          onOpenChange();
          refetch();
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
    } catch (error) {
      onOpenChange();
    }
  };
  if (VehicleTypeId === null) {
    return null;
  }
  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <div className="flex justify-end">
            <Button
              size="small"
              variant="text"
              color="error"
              sx={{
                position: "absolute",
                right: "5",
                top: "5",
                padding: "5px",
              }}
            >
              <CloseIcon onClick={handleClose} className="cursor-pointer " />
            </Button>
          </div>
          <DialogTitle>Add New Price Table</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddPriceTable)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={2}>
                  <Grid
                    xs={12}
                    sx={{
                      display: "none",
                    }}
                  >
                    <FormInput
                      name="vehicleTypeId"
                      value={VehicleTypeId}
                      defaultValue={VehicleTypeId}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <div className="min-w-full">
                      <FormInput
                        name="name"
                        autoFocus={true}
                        label="Table name"
                        placeholder="Table name"
                      />
                    </div>
                  </Grid>
                  <Grid xs={6}>
                    <div className="w-full">
                      <FormInput
                        label="Priority"
                        name="priority"
                        type="number"
                        placeholder="Priority"
                      />
                    </div>
                  </Grid>
                  <Grid xs={6}>
                    <FormDatePicker
                      minDate={moment()}
                      name="applyFromDate"
                      label="Apply From"
                      defaultValue={moment()}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <FormDatePicker
                      name="applyToDate"
                      label="Apply To"
                      minDate={moment()}
                    />
                  </Grid>
                  <Grid xs={12}>
                    <div className="min-w-full">
                      <FormInput
                        label="Price per Block"
                        name="pricePerBlock"
                        placeholder="Price per Block"
                        type="number"
                        endAdornment="VND"
                      />
                    </div>
                  </Grid>
                  <Grid xs={6}>
                    <div className="min-w-full">
                      <FormInput
                        name="minPrice"
                        label="Min Price"
                        placeholder="Min Price"
                        type="number"
                        endAdornment="VND"
                      />
                    </div>
                  </Grid>
                  <Grid xs={6}>
                    <div className="min-w-full">
                      <FormInput
                        name="maxPrice"
                        label="Max Price"
                        placeholder="Max Price"
                        type="number"
                        endAdornment="VND"
                      />
                    </div>
                  </Grid>
                  <Grid xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={registerPriceItem}
                          onChange={handleRegisterPriceItemChange}
                        />
                      }
                      label="Register Price Item"
                    />
                  </Grid>
                  {registerPriceItem && (
                    <div className="flex flex-col gap-5">
                      {fields.map((field, index) => (
                        <Grid
                          xs={12}
                          container
                          alignItems={"center"}
                          key={field.id}
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
                                    blockPricing: 0,
                                    from: 0,
                                    to: 0,
                                    maxPrice: 0,
                                    minPrice: 0,
                                  })
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            )}
                          </Grid>
                          <Grid xs={10.5} container spacing={1}>
                            <Grid xs={3.9}>
                              <FormInput
                                name={`priceItems[${index}].from`}
                                label="From"
                                type="number"
                                placeholder="From"
                              />
                            </Grid>
                            <Grid xs={3.9}>
                              <FormInput
                                name={`priceItems[${index}].to`}
                                label="To"
                                type="number"
                                placeholder="To"
                              />
                            </Grid>
                            <Grid xs={3.9}>
                              <FormInput
                                name={`priceItems[${index}].blockPricing`}
                                label="Block Pricing"
                                type="number"
                                placeholder="Block Pricing"
                              />
                            </Grid>
                            <Grid xs={3.9}>
                              <FormInput
                                name={`priceItems[${index}].minPrice`}
                                label="Min Price"
                                type="number"
                                placeholder="Min Price"
                              />
                            </Grid>
                            <Grid xs={3.9}>
                              <FormInput
                                name={`priceItems[${index}].maxPrice`}
                                label="Max Price"
                                type="number"
                                placeholder="Max Price"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      ))}
                    </div>
                  )}
                  <DialogActions className="flex justify-end min-w-full">
                    <ComboFormButton
                      onClose={handleClose}
                      onReset={() => reset()}
                      submitLabel="Create"
                      isLoading={createTableMutation.isPending}
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
