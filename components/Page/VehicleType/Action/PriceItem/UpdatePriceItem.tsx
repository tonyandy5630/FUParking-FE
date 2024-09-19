import { updatePriceItemsAPI } from "@/api/price-item";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import { PriceItem } from "@/types/price-item.type";
import PriceItemRequestSchema from "@/utils/schemas/priceItemSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FormInput from "@/components/Form/Input";
import ComboFormButton from "@/components/Dialog/ComboButton";

type UpdatePriceItemProps = DialogProps & {
  priceItems: PriceItem[] | undefined;
  priceTableId: string;
  refetch: () => void;
};

export default function UpdatePriceItem({
  open,
  onClose,
  onOpenChange,
  priceItems,
  priceTableId,
  refetch,
}: UpdatePriceItemProps) {
  const methods = useForm({
    resolver: yupResolver(PriceItemRequestSchema),
    defaultValues: {
      priceTableId: priceTableId,
      priceItems: priceItems || [],
    },
  });

  const updatePriceItemsMutation = useMutation({
    mutationKey: ["/update-price-items"],
    mutationFn: updatePriceItemsAPI,
  });

  const {
    reset,
    handleSubmit,
    resetField,
    setError,
    setFocus,
    formState: { errors, isDirty, dirtyFields },
    control,
  } = methods;

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleClose = () => {
    if (isDirty && dirtyFields) {
      setShowConfirmDialog(true);
    } else {
      onClose && onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleUpdatePriceItems = async (data: any) => {
    try {
      console.log(data);
      await updatePriceItemsMutation.mutateAsync(data, {
        onSuccess: (res) => {
          refetch();
          onOpenChange();
          toast.success("Update items successfully");
        },
      });
    } catch (error: any) {
      const priceItemsError = error.response.data.data.PriceItems;
      if (priceItemsError) {
        toast.error(priceItemsError[0]);
      }
    }
  };

  const handleOpenChange = () => {
    onOpenChange();
    reset();
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceItems",
  });

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
              onClick={handleClose}
            >
              <CloseIcon />
            </Button>
          </div>
          <DialogTitle>Update price item</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleUpdatePriceItems)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={1}>
                  <div className="hidden">
                    <Grid item xs={12}>
                      <FormInput
                        name="priceTableId"
                        label="Price Table Id"
                        disabled
                      />
                    </Grid>
                  </div>
                  {fields.map((field, index) => (
                    <Grid
                      item
                      xs={12}
                      key={field.id}
                      className="flex gap-2 items-center"
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
                                blockPricing: 0,
                                applyFromHour: 0,
                                applyToHour: 0,
                                maxPrice: 0,
                                minPrice: 0,
                              })
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item xs={10.5} container spacing={1}>
                        <Grid item xs={2.4}>
                          <FormInput
                            name={`priceItems[${index}].blockPricing`}
                            label="Block Pricing"
                            defaultValue={field.blockPricing}
                          />
                        </Grid>
                        <Grid item xs={2.4}>
                          <FormInput
                            name={`priceItems[${index}].from`}
                            label="From"
                            defaultValue={field.applyFromHour}
                          />
                        </Grid>
                        <Grid item xs={2.4}>
                          <FormInput
                            name={`priceItems[${index}].to`}
                            label="To"
                            defaultValue={field.applyToHour}
                          />
                        </Grid>
                        <Grid item xs={2.4}>
                          <FormInput
                            name={`priceItems[${index}].minPrice`}
                            label="Min Price"
                            defaultValue={field.minPrice}
                          />
                        </Grid>
                        <Grid item xs={2.4}>
                          <FormInput
                            name={`priceItems[${index}].maxPrice`}
                            label="Max Price"
                            defaultValue={field.maxPrice}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <DialogActions>
                      <ComboFormButton
                        submitLabel="Update"
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
