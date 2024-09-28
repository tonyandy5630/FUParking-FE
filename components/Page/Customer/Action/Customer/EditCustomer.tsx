import { DialogProps } from "@/types/dialog.type";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "@/components/modal/modal";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { FormProvider } from "react-hook-form";
import FormSelectSearch from "@/components/Form/SelectSearch";
import ComboFormButton from "@/components/Dialog/ComboButton";
import EditCustomerSchema, {
  EditCustomerSchemaType,
} from "@/utils/schemas/customer/editCustomerSchema";
import FormInput from "@/components/Form/Input";
import { editCustomerAPI, getCustomerTypesAPI } from "@/api/customer";

type EditCustomerProps = DialogProps & {
  refresh: () => void;
  EditCustomerForm?: EditCustomerSchemaType;
};

export default function EditCustomer({
  open,
  onClose,
  onOpenChange,
  EditCustomerForm,
  refresh,
}: EditCustomerProps) {
  const methods = useForm({
    resolver: yupResolver(EditCustomerSchema),
    defaultValues: {
      customerId: EditCustomerForm?.customerId,
      customerTypeId: EditCustomerForm?.customerTypeId,
      fullName: EditCustomerForm?.fullName,
      email: EditCustomerForm?.email,
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
  const { mutateAsync: EditCustomerAsync } = useMutation({
    mutationKey: ["/customers/update"],
    mutationFn: editCustomerAPI,
  });

  const { data: customerTypes, isLoading: customerTypesLoading } = useQuery({
    queryKey: ["/customer-types"],
    queryFn: async () => await getCustomerTypesAPI,
  });

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const handleEditCustomer = async (data: EditCustomerSchemaType) => {
    try {
      await EditCustomerAsync(data, {
        onSuccess: (res) => {
          toast.success("Update successfully");
          refresh();
          onOpenChange();
        },
      });
    } catch (error: any) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
      setFocus("email");
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} setOpen={onOpenChange}>
        <div className='p-5 flex flex-col'>
          <DialogTitle>Update customer information</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleEditCustomer)}>
              <DialogContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Grid item xs={12}>
                  <FormInput
                    name={"fullName"}
                    label='Full Name'
                    disabled={customerTypesLoading}
                    defaultValue={EditCustomerForm?.fullName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormInput
                    name={"email"}
                    label='Email'
                    disabled={customerTypesLoading}
                    defaultValue={EditCustomerForm?.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormSelectSearch
                    name={"customerTypeId"}
                    label='Customer Type'
                    required={true}
                    options={
                      customerTypesLoading
                        ? [{ name: "Loading...", value: "" }]
                        : customerTypes?.data?.data?.map((item) => ({
                            name: item.name,
                            value: item.id,
                          })) || []
                    }
                    disabled={customerTypesLoading}
                    defaultValue={EditCustomerForm?.customerTypeId}
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
