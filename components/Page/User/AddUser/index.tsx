import { addUserAPI } from "@/api/user";
import AlertDialog from "@/components/Dialog/ConfirmDialog";
import { Role } from "@/constant/enum";
import useHandleDialog from "@/hook/useHandleDialog";
import { DialogProps } from "@/types/dialog.type";
import UserSchema, { UserSchemaType } from "@/utils/schemas/loginSchema";
import SystemUserSchema, {
  SystemUserSchemaType,
} from "@/utils/schemas/userSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "@/components/Form/Input";
import FormRadioGroup from "@/components/Form/RadioGroup";
import { FormOptions } from "@/components/Form/Select";
import { RoleOptions } from "../UserTable";
import ComboFormButton from "@/components/Dialog/ComboButton";

interface Props extends DialogProps {
  successCallback: () => void;
}

export default function AddUserDialog({
  open,
  onClose,
  onOpenChange,
  successCallback,
}: Props) {
  const { openDialog: openAlertDialog, handleToggleDialog: toggleAlertDialog } =
    useHandleDialog(false);

  const methods = useForm({ resolver: yupResolver(SystemUserSchema) });
  const { reset, handleSubmit } = methods;

  const { mutateAsync: addUserAsync, isPending: isPendingAddUser } =
    useMutation({
      mutationKey: ["/add-user"],
      mutationFn: addUserAPI,
    });

  const handleAddUser = async (data: SystemUserSchemaType) => {
    try {
      const addUserData = {
        data,
        role: data.role as Role,
      };
      await addUserAsync(addUserData, {
        onSuccess: () => {
          toast.success("Add user Successfully");
          reset();
          successCallback();
        },
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleAddUserClose = () => {
    toggleAlertDialog();
  };

  const handleConfirmAlertDialog = () => {
    toggleAlertDialog();
    if (onClose) onClose();
  };
  return (
    <>
      {openAlertDialog && (
        <AlertDialog
          open={openAlertDialog}
          onCancel={toggleAlertDialog}
          onConfirm={handleConfirmAlertDialog}
          title="Confirm cancel Add User?"
          content="Click OK will CLOSE and RESET the form"
          onOpenChange={toggleAlertDialog}
        />
      )}
      <Dialog open={open} maxWidth="sm" onClose={handleAddUserClose}>
        <DialogTitle>Add User</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAddUser)}>
            <DialogContent>
              <Grid container spacing={2}>
                <Grid xs={12}>
                  <FormInput
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                  />
                </Grid>
                <Grid xs={12}>
                  <FormInput
                    name="fullName"
                    label="Full Name"
                    placeholder="Enter fullname"
                  />
                </Grid>
                <Grid xs={12}>
                  <FormInput
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                  />
                </Grid>
                <Grid>
                  <FormRadioGroup
                    row={true}
                    options={RoleOptions}
                    name="role"
                    label="Role"
                  />
                </Grid>
              </Grid>
              <Grid>
                <DialogActions>
                  <ComboFormButton
                    submitLabel="Create"
                    onClose={onOpenChange}
                    onReset={reset}
                    isLoading={isPendingAddUser}
                  />
                </DialogActions>
              </Grid>
            </DialogContent>
          </form>
        </FormProvider>
      </Dialog>
    </>
  );
}
