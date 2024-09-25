import { editPackageAPI, updatePackageAPI } from "@/api/package";
import Modal from "@/components/modal/modal";
import { DialogProps } from "@/types/dialog.type";
import { Packages } from "@/types/package.type";
import {
  UpdatePackageSchema,
  UpdatePackageSchemaType,
} from "@/utils/schemas/PackageSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import FormInput from "@/components/Form/Input";
import {
  EditPackageSchema,
  EditPackageSchemaType,
} from "@/utils/schemas/package/EditPackageSchema";
import ComboFormButton from "@/components/Dialog/ComboButton";

type EditPackageProps = DialogProps & {
  packageObject: Packages;
  refetch: () => void;
};

export default function EditPackage({
  open,
  onClose,
  onOpenChange,
  packageObject,
  refetch,
}: EditPackageProps) {
  const methods = useForm({
    resolver: yupResolver(EditPackageSchema),
    defaultValues: {
      packageId: packageObject.id,
      name: packageObject.name,
      isActive: packageObject.packageStatus === "ACTIVE" ? true : false,
    },
  });
  const {
    reset,
    formState: { errors, isDirty, dirtyFields },
    handleSubmit,
  } = methods;

  const { mutateAsync: updatePackageAsync, isPending } = useMutation({
    mutationKey: ["/edit-package"],
    mutationFn: editPackageAPI,
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleUpdatePackage = async (data: EditPackageSchemaType) => {
    data.isActive = packageObject.packageStatus === "ACTIVE" ? true : false;
    try {
      await updatePackageAsync(data, {
        onSuccess: () => {
          refetch();
          onOpenChange();
          toast.success("Update package successfully");
        },
      });
    } catch (error) {
      onOpenChange();
    }
  };

  const handleClose = () => {
    if (isDirty && dirtyFields) {
      setShowConfirmDialog(true);
    } else {
      onClose && onClose();
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className="p-5 flex flex-col">
          <DialogTitle>Update package</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleUpdatePackage)}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div className="hidden">
                  <FormInput
                    name="packageId"
                    label="PackageId"
                    defaultValue={packageObject.id}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        {...methods.register("isActive")}
                        defaultChecked={
                          packageObject.packageStatus === "ACTIVE"
                        }
                      />
                    }
                    label="Is Active"
                  />
                </div>
                <Grid item xs={12}>
                  <FormInput
                    name="name"
                    label="Package Name"
                    placeholder="Enter package name"
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
