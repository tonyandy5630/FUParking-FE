import { useCallback, useEffect, useMemo, memo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@/types/dialog.type";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
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
import { IconButton } from "@mui/material";
import dynamic from "next/dynamic";
const RemoveIcon = dynamic(() => import("@mui/icons-material/Remove"));
import AddIcon from "@mui/icons-material/Add";

interface Props extends DialogProps {
  tablePriceId: string;
}

function AddPriceItemDialog({ onOpenChange, open, tablePriceId }: Props) {
  const methods = useForm({
    resolver: yupResolver(PriceItemRequestSchema),
    defaultValues: {
      priceTableId: tablePriceId,
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    getValues,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "priceItems",
    rules: {
      minLength: 1,
    },
  });

  const createPriceItemMutation = useMutation({
    mutationKey: ["/update-price-items"],
    mutationFn: updatePriceItemsAPI,
  });

  const handleCreatePriceItems = async (data: PriceItemRequestSchemaType) => {
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

  const handleAddField = useCallback(() => {
    append({
      from: 0,
      to: 1,
      blockPricing: 4000,
      maxPrice: 5000,
      minPrice: 4000,
    });
  }, []);

  useEffect(() => {
    //* Run twice in DEV
    handleAddField();
  }, []);

  const priceItemFields = useMemo(() => {
    return fields.map((item, index) => {
      return (
        <Grid
          className='flex items-start'
          xs={12}
          key={item.id}
          alignItems='center'
        >
          <IconButton onClick={() => remove(index)} color='error'>
            <RemoveIcon />
          </IconButton>
          <PriceItemInput
            fieldArrayName='priceItems'
            index={index}
            error={errors}
          />
        </Grid>
      );
    });
  }, [fields.length, errors]);

  return (
    <Dialog open={open} onClose={onOpenChange} maxWidth='md'>
      <DialogTitle>Add Price Items</DialogTitle>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleCreatePriceItems)}>
          <DialogContent>
            <Grid container spacing={2}>
              {priceItemFields}
            </Grid>
            <Grid xs={12} className='flex justify-center items-center'>
              <IconButton onClick={handleAddField} color='primary'>
                <AddIcon />
              </IconButton>
            </Grid>
          </DialogContent>
          <DialogActions className='flex justify-end min-w-full'>
            <ComboFormButton
              onClose={onOpenChange}
              onReset={() => {
                reset();
              }}
              submitLabel='Create'
              isLoading={createPriceItemMutation.isPending}
            />
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
}

export default memo(AddPriceItemDialog);
