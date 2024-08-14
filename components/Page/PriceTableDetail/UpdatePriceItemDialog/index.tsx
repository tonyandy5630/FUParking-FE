import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CreatePriceItemSchema, {
  CreatePriceItemSchemaType,
} from "@/utils/schemas/priceItemSchema";
import Grid from "@mui/material/Unstable_Grid2";
import { useMutation } from "@tanstack/react-query";
import { updatePriceItemsAPI } from "@/api/price-item";
import { toast } from "react-toastify";
import PriceItemInput from "./PriceItemInput";
import { Button, IconButton } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { PriceItem } from "@/types/price-item.type";

interface Props extends DialogProps {
  tablePriceId: string;
  priceItems: Array<PriceItem>;
}

export default function AddPriceItemDialog({
  onOpenChange,
  open,
  tablePriceId,
  priceItems,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(CreatePriceItemSchema),
    defaultValues: {
      priceTableId: tablePriceId,
    },
  });
  const createPriceItemMutation = useMutation({
    mutationKey: ["/update-price-items"],
    mutationFn: updatePriceItemsAPI,
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
    getValues,
  } = methods;

  const handleUpdatePriceItems = async (data: CreatePriceItemSchemaType) => {
    try {
      await createPriceItemMutation.mutateAsync(data, {
        onSuccess: (res) => {
          toast.success("Create items successfully");
          reset();
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const priceItemFields = useMemo(() => {
    return priceItems.map((item, index) => {
      return (
        <Grid className='flex items-start' xs={12} key={item.id}>
          <PriceItemInput
            fieldArrayName='priceItems'
            index={index}
            value={item}
          />
        </Grid>
      );
    });
  }, [priceItems.length]);

  return (
    <Dialog open={open} onClose={onOpenChange} maxWidth='md'>
      <DialogTitle>Add Price Items</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleUpdatePriceItems)}>
          <DialogContent>
            <Grid container spacing={2}>
              {priceItemFields}
            </Grid>
          </DialogContent>
          <DialogActions className='flex justify-end min-w-full'>
            <ComboFormButton
              onClose={onOpenChange}
              onReset={() => reset()}
              submitLabel='Create'
              isLoading={createPriceItemMutation.isPending}
            />
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
