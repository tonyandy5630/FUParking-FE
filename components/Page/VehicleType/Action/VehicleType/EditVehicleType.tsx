import { updateVehicleTypeAPI } from "@/api/vehicleType";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import { VehicleTypeProps } from "@/types/vehicleType.type";
import EditVehicleTypeSchema, {
  EditVehicleTypeSchemaType,
} from "@/utils/schemas/vehicleType/editVehicleType";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import ComboFormButton from "@/components/Dialog/ComboButton";

export default function EditVehicleType({
  id,
  setIsPending,
  disable,
  refetch,
  value,
}: {
  id: string;
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
  refetch: () => void;
  value: VehicleTypeProps;
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
  const methods = useForm<EditVehicleTypeSchemaType>({
    resolver: yupResolver(EditVehicleTypeSchema),
    defaultValues: {
      id: value.id,
    },
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { dirtyFields, isDirty },
  } = methods;

  const editVehicleTypeMutation = useMutation({
    mutationKey: ["/udpate-vehicleTypes"],
    mutationFn: updateVehicleTypeAPI,
    onMutate: () => {
      setIsPending(true);
    },
  });

  const onSubmit = async (data: EditVehicleTypeSchemaType) => {
    try {
      if (!data.name && !data.description) {
        setError("description", {
          type: "manual",
          message: "Either name or description must be provided",
        });
        return;
      }
      await editVehicleTypeMutation.mutateAsync(data, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          reset();
          setIsOpen(false);
          refetch();
          setIsPending(false);
        },
        onError: () => {
          toast.error("Failed to edit vehicle type");
          setIsPending(false);
          refetch();
        },
      });
    } catch (error) {
      toast.error("Failed to edit vehicle type");
      setIsPending(false);
      refetch();
    }
  };

  return (
    <>
      <Button
        size="small"
        onClick={() => setIsOpen(true)}
        disabled={disable}
        variant="outlined"
      >
        Edit
      </Button>
      <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
        <div className="p-5 flex flex-col">
          <DialogContent>Vehicle Type</DialogContent>
          <FormProvider {...methods}>
            <FormControl>
              <form
                className="flex flex-col space-y-2"
                onSubmit={handleSubmit(onSubmit)}
              >
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
                        label="Name Vehicle Type"
                        placeholder="Enter Name"
                        autoFocus={true}
                        key="name"
                        defaultValue={value.name}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormInput
                        name="description"
                        label="Description"
                        placeholder="Enter description"
                        key="description"
                        defaultValue={value.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <DialogActions className="flex justify-end min-w-full">
                        <ComboFormButton
                          onClose={handleClose}
                          onReset={() => reset()}
                          submitLabel="Update"
                        />
                      </DialogActions>
                    </Grid>
                  </Grid>
                </DialogContent>
              </form>
            </FormControl>
          </FormProvider>
        </div>
      </Modal>
    </>
  );
}
