import { editUserAPI, listRoleAPI } from "@/api/user";
import Modal from "@/components/modal/modal";
import { DynamicResponse } from "@/types";
import { DialogProps } from "@/types/dialog.type";
import { User } from "@/types/user.type";
import EditUserSchema, {
  EditUserSchemaType,
} from "@/utils/schemas/user/editUserSchema";
import CloseIcon from "@mui/icons-material/Close";
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
import FormInput from "@/components/Form/Input";
import FormSelect from "@/components/Form/Select";
import ComboFormButton from "@/components/Dialog/ComboButton";
import { IconButton } from "@mui/material";
const VisibilityOffIcon = dynamic(
  () => import("@mui/icons-material/VisibilityOff")
);
const VisibilityIcon = dynamic(() => import("@mui/icons-material/Visibility"));
import dynamic from "next/dynamic";

type EditUserProps = DialogProps & {
  user: User | undefined;
  refetch: () => void;
};

export default function EditUser({
  open,
  onOpenChange,
  user,
  onClose,
  refetch,
}: EditUserProps) {
  const methods = useForm({
    resolver: yupResolver(EditUserSchema),
    defaultValues: {
      id: user?.id,
      fullName: user?.fullName,
      email: user?.email,
      roleId: user?.roleId,
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const editUserMuation = useMutation({
    mutationKey: ["/update-user"],
    mutationFn: editUserAPI,
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

  const { data: roleData, isPending: roleIsPending } = useQuery({
    queryKey: ["/role"],
    queryFn: async () => await listRoleAPI(),
  });

  const handleEditUser = async (data: EditUserSchemaType) => {
    try {
      await editUserMuation.mutateAsync(data, {
        onSuccess: (res: DynamicResponse) => {
          refetch();
          toast.success(res.message);
          onOpenChange();
        },
      });
    } catch (error) {}
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className='p-5 flex flex-col'>
          <DialogTitle>Edit User Information</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEditUser)}>
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={2}>
                  <div className='hidden'>
                    <Grid item xs={12}>
                      <FormInput
                        name='id'
                        label='Id'
                        disabled
                        defaultValue={user?.id}
                      />
                    </Grid>
                  </div>
                  <Grid item xs={12}>
                    <FormInput
                      name='fullName'
                      label='Full Name'
                      defaultValue={user?.fullName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput
                      name='email'
                      label='Email'
                      defaultValue={user?.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormSelect
                      name='roleId'
                      label='Role'
                      options={
                        roleIsPending
                          ? [{ name: "Loading...", value: "" }]
                          : roleData?.data?.data?.map((item) => ({
                              name: item.name,
                              value: item.roleId,
                            })) || []
                      }
                      defaultValue={user?.roleId}
                      disabled={roleIsPending}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormInput
                      type={showPassword ? "text" : "password"}
                      name='password'
                      required={false}
                      label='New Password'
                      placeholder='Enter new password'
                      endAdornment={
                        <IconButton onClick={() => handleShowPassword()}>
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <DialogActions>
                      <ComboFormButton
                        submitLabel='Update'
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
          <Button onClick={handleConfirmClose} color='primary'>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
