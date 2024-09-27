import { createVehicleTypeAPI } from "@/api/vehicleType";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import CreateVehicleTypeSchema, {
  CreateVehicleTypeSchemaType,
} from "@/utils/schemas/vehicleType/createVehicleType";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import ComboFormButton from "@/components/Dialog/ComboButton";

export default function CreateVehicleType({
  setIsPending,
  disable,
  refetch,
}: {
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
  refetch: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleClose = () => {
    if (isDirty && Object.keys(dirtyFields).length > 0) {
      setShowConfirmDialog(true);
    } else {
      setIsOpen(false);
    }
  };
  const methods = useForm<CreateVehicleTypeSchemaType>({
    defaultValues: {
      name: "",
      description: "",
      blockPricing: 0,
      maxPrice: 0,
      minPrice: 0,
    },
    resolver: yupResolver(CreateVehicleTypeSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { dirtyFields, isDirty },
  } = methods;
  const createVehicleTypeMutation = useMutation({
    mutationKey: ["/vehicleTypes"],
    mutationFn: createVehicleTypeAPI,
    onMutate: () => {
      setIsPending(true);
    },
  });

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setIsOpen(false);
    reset();
  };
  const onSubmit = async (data: {
    name: string;
    description?: string | undefined;
  }) => {
    try {
      await createVehicleTypeMutation.mutateAsync(data, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          reset();
          setIsOpen(false);
          refetch();
          setIsPending(false);
        },
        onError: (error) => {
          toast.error("Failed to create vehicle type");
          setIsPending(false);
          refetch();
        },
      });
    } catch (error) {
      toast.error("Failed to create vehicle type");
    }
  };

  return (
    <>
      <Button
        variant='outlined'
        color='primary'
        disabled={disable}
        onClick={() => setIsOpen(true)}
      >
        Create Vehicle Type
      </Button>
      <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
        <div className='p-5 flex flex-col'>
          <DialogContent>Vehicle Type</DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6}>
                    <FormInput
                      name='name'
                      label='Name Vehicle Type'
                      placeholder='Enter Name'
                      autoFocus={true}
                      key='name'
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormInput
                      name='description'
                      label='Description'
                      placeholder='Enter description'
                      key='description'
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormInput
                      name='blockPricing'
                      label='Block Pricing'
                      placeholder='Enter block pricing'
                      key='blockPricing'
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormInput
                      name='maxPrice'
                      label='Max Price'
                      placeholder='Enter max price'
                      key='maxPrice'
                      required={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormInput
                      name='minPrice'
                      label='Min Price'
                      placeholder='Enter min price'
                      key='minPrice'
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DialogActions className='flex justify-end min-w-full'>
                      <ComboFormButton
                        onClose={handleClose}
                        onReset={() => reset()}
                        submitLabel='Create'
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
          <Button onClick={handleConfirmClose} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
