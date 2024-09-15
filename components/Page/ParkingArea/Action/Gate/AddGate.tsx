import { addGateAPI } from "@/api/gate";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import AddGateSchema, {
  AddGateSchemaType,
} from "@/utils/schemas/gate/addGateSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FormInput from "@/components/Form/Input";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { toast } from "react-toastify";

type AddGateProps = DialogProps & {
  areaId: string;
  refresh: () => void;
};

export default function AddGate({
  open,
  onClose,
  onOpenChange,
  areaId,
  refresh,
}: AddGateProps) {
  const methods = useForm({
    resolver: yupResolver(AddGateSchema),
    defaultValues: { gates: [{ name: "", description: "" }] },
  });

  const handleClose = () => {
    if (isDirty && Object.keys(dirtyFields).length > 0) {
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
  const { isDirty, dirtyFields } = formState;
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gates",
  });

  const { mutateAsync: addGateAsync, isPending } = useMutation({
    mutationKey: ["/gates"],
    mutationFn: addGateAPI,
  });

  const handleAddGate = async (formData: AddGateSchemaType) => {
    const gateData = {
      parkingAreaId: areaId,
      gates: formData.gates,
    };
    try {
      await addGateAsync(gateData, {
        onSuccess: (data, variable, context) => {
          refresh();
          onOpenChange();
          toast.success("Gate added successfully");
        },
      });
    } catch (error: any) {}
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  return (
    <>
      <Modal open={open} onClose={onClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <div className="flex justify-end">
            <CloseIcon onClick={handleClose} className="cursor-pointer " />
          </div>
          <DialogTitle>Register Gate</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddGate)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={1}>
                  {fields.map((field, index) => (
                    <Grid
                      item
                      xs={12}
                      container
                      alignContent={"center"}
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
                                name: "",
                                description: "",
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
                            name={`gates[${index}].name`}
                            label="Name"
                            placeholder="Enter name"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormInput
                            name={`gates[${index}].description`}
                            label="Description"
                            placeholder="Enter description"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
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
