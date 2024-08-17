import React, { useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PriceItemRequestSchema, {
  PriceItemRequestSchemaType,
} from "@/utils/schemas/priceItemSchema";
import Grid from "@mui/material/Unstable_Grid2";
import { useMutation } from "@tanstack/react-query";
import { updatePriceItemsAPI } from "@/api/price-item";
import { toast } from "react-toastify";
import PriceItemInput from "../PriceItemInput";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { PriceItem } from "@/types/price-item.type";

interface Props extends DialogProps {
  tablePriceId: string;
  priceItems: Array<PriceItem>;
}

export default function UpdatePriceItemDialog({
  onOpenChange,
  open,
  tablePriceId,
  priceItems,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(PriceItemRequestSchema),
    defaultValues: {
      priceTableId: tablePriceId,
    },
  });
  const createPriceItemMutation = useMutation({
    mutationKey: ["/update-price-items"],
    mutationFn: updatePriceItemsAPI,
  });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const handleUpdatePriceItems = async (data: PriceItemRequestSchemaType) => {
    try {
      await createPriceItemMutation.mutateAsync(data, {
        onSuccess: (res) => {
          toast.success("Create items successfully");
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

  const priceItemFields = useMemo(() => {
    const filteredDefaultPriceItem = priceItems.filter(
      (item) =>
        Number.isInteger(item.applyFromHour) ||
        Number.isInteger(item.applyToHour)
    );

    return filteredDefaultPriceItem.map((item, index) => {
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
  }, [priceItems]);

  return (
    <Dialog open={open} onClose={onOpenChange} maxWidth='md'>
      <DialogTitle>Update Price Items</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleUpdatePriceItems)}>
          <DialogContent>
            <Grid container spacing={2}>
              {priceItemFields}
            </Grid>
          </DialogContent>
          <DialogActions className='flex justify-end min-w-full'>
            <ComboFormButton
              onClose={handleOpenChange}
              onReset={() => reset()}
              submitLabel='Update'
              isLoading={createPriceItemMutation.isPending}
            />
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}
