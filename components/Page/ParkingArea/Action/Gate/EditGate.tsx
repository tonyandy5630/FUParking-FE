import { deleteGateAPI, updateGateAPI } from "@/api/gate";
import { getAllParkingAreaAPI } from "@/api/parkingArea";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import EditGateSchema, {
  EditGateSchemaType,
} from "@/utils/schemas/gate/editGateSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import FormInput from "@/components/Form/Input";
import FormSelect from "@/components/Form/Select";
import ComboFormButton from "@/components/Dialog/ComboButton";

type EditGateProps = DialogProps & {
  refresh: () => void;
  EditGateForm?: EditGateSchemaType;
  gateId: string;
};

export default function EditGate({
  open,
  onClose,
  onOpenChange,
  gateId,
  EditGateForm,
  refresh,
}: EditGateProps) {
  const methods = useForm({
    resolver: yupResolver(EditGateSchema),
    defaultValues: {
      description: EditGateForm?.description,
      name: EditGateForm?.name,
      parkingAreaId: EditGateForm?.parkingAreaId,
    },
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const handleClose = () => {
    const { isDirty, dirtyFields } = methods.formState;
    if (isDirty && dirtyFields) {
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

  const { mutateAsync: EditGateAsync } = useMutation({
    mutationKey: ["/gate/edit"],
    mutationFn: updateGateAPI,
  });

  const { data: parkingAreaOption, isLoading: parkingAreaLoading } = useQuery({
    queryKey: ["/parkingArea/options"],
    queryFn: async () => await getAllParkingAreaAPI(),
  });

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleEditGate = async (data: EditGateSchemaType) => {
    try {
      const updateGateBody = {
        data,
        gateId: gateId,
      };
      await EditGateAsync(updateGateBody, {
        onSuccess: (res) => {
          toast.success("Update successfully");
          refresh();
          onOpenChange();
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogTitle>Update gate information</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEditGate)}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Grid item xs={12}>
                  <FormInput
                    name="name"
                    label="Name"
                    defaultValue={EditGateForm?.name}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    name="description"
                    label="Description"
                    defaultValue={EditGateForm?.description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelect
                    name="parkingAreaId"
                    label="Parking Area"
                    options={
                      parkingAreaLoading
                        ? [{ name: "Loading...", value: "" }]
                        : parkingAreaOption?.data?.data?.map((item) => ({
                            name: item.name,
                            value: item.id,
                          })) || []
                    }
                    defaultValue={EditGateForm?.parkingAreaId}
                  />
                </Grid>
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
