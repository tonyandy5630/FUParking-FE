import { DialogProps } from "@/types/dialog.type";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useMutation } from "@tanstack/react-query";
import { deletePackageAPI, updatePackageAPI } from "@/api/package";
import {
  UpdatePackageSchema,
  UpdatePackageSchemaType,
} from "@/utils/schemas/PackageSchema";
import { toast } from "react-toastify";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useHandleDialog from "@/hook/useHandleDialog";
import Grid from "@mui/material/Unstable_Grid2";
import FormInput from "@/components/Form/Input";
import ComboFormButton from "@/components/Dialog/ComboButton";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"));
import { OBJECT_EXISTED_MESSAGE } from "@/constant/message";
import { Packages } from "@/types/package.type";
import DeleteButton from "@/components/DeleteButton";
import dynamic from "next/dynamic";

interface Props extends DialogProps {
  successCallback: () => void;
  value: Packages;
}

export default function UpdatePackageDialog({
  open,
  onOpenChange,
  onClose,
  successCallback,
  value,
}: Props) {
  const methods = useForm({
    resolver: yupResolver(UpdatePackageSchema),
    defaultValues: {
      isActive: value.packageStatus === "INACTIVE" ? false : true,
      packageId: value.id,
    },
  });
  const {
    reset,
    formState: { errors },
    handleSubmit,
    setError,
    setValue,
    setFocus,
    getValues,
  } = methods;
  const {
    openDialog: openConfirmDialog,
    handleOpenDialog: handleOpenConfirmDialog,
    handleCloseDialog: handleCloseConfirmDialog,
  } = useHandleDialog(false);

  const { mutateAsync: updatePackageAsync, isPending } = useMutation({
    mutationKey: ["/add-package"],
    mutationFn: updatePackageAPI,
  });

  const { mutateAsync: deletePackageAsync, isPending: isPendingDeletePackage } =
    useMutation({
      mutationKey: ["/delete-package"],
      mutationFn: deletePackageAPI,
    });

  const handleConfirmDialog = () => {
    handleCloseConfirmDialog();
    reset();
    if (onClose) onClose();
  };

  const handleDeletePackage = async () => {
    try {
      await deletePackageAsync(value.id, {
        onSuccess: () => {
          toast.success("Delete Package Successfully");
          successCallback();
          if (onClose) onClose();
        },
      });
    } catch (error) {}
  };

  const handleCloseUpdateDialog = () => {
    handleOpenConfirmDialog();
  };

  const handleUpdatePackage = async (data: UpdatePackageSchemaType) => {
    try {
      await updatePackageAsync(data, {
        onSuccess(data) {
          toast.success("Add package successfully");
          successCallback();
        },
      });
    } catch (error: any) {
      if (error.response.data.message === OBJECT_EXISTED_MESSAGE) {
        setError("name", {
          type: "validate",
          message: "Package name is existed",
        });
        setFocus("name");
      }
    }
  };

  return (
    <>
      {openConfirmDialog && (
        <AlertDialog
          open={openConfirmDialog}
          onCancel={handleCloseConfirmDialog}
          onConfirm={handleConfirmDialog}
          title='Confirm cancel Update Package?'
          content='Click OK will CLOSE and RESET the form'
          onOpenChange={handleCloseConfirmDialog}
        />
      )}
      <Dialog open={open} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Update Package</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleUpdatePackage)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <div className='min-w-full'>
                    <FormInput
                      name='name'
                      label='Package Name'
                      placeholder='Enter package name'
                      defaultValue={value.name}
                    />
                  </div>
                </Grid>
                <Grid xs={12}>
                  <div className='min-w-full flex justify-between items-center'>
                    <DeleteButton onDelete={handleDeletePackage}>
                      Delete
                    </DeleteButton>
                    <DialogActions>
                      <ComboFormButton
                        submitLabel='Update'
                        isLoading={isPending}
                        onClose={handleConfirmDialog}
                        onReset={reset}
                      />
                    </DialogActions>
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
