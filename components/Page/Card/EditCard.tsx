import { editCardAPI } from "@/api/card";
const AlertDialog = dynamic(() => import("@/components/Dialog/ConfirmDialog"));
const FormInput = dynamic(() => import("@/components/Form/Input"));
const Modal = dynamic(() => import("@/components/modal/modal"));
import { ListCardResponse } from "@/types/card.type";
import EditCardSchema, {
  EditCardSchemaType,
} from "@/utils/schemas/card/editCardSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import dynamic from "next/dynamic";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EditCard({
  id,
  setIsPending,
  disable,
  refetch,
  value,
}: {
  id: string;
  setIsPending: (isPending: boolean) => void;
  disable: boolean;
  value: string;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<AxiosResponse<ListCardResponse, any>, Error>
  >;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const handleClose = () => {
    setOpenConfirmDialog(true);
  };
  const methods = useForm<EditCardSchemaType>({
    resolver: yupResolver(EditCardSchema),
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors },
  } = methods;
  const editCardMutation = useMutation({
    mutationKey: ["/cards"],
    mutationFn: (data: { plateNumber: string }) => editCardAPI(id, data),
    onMutate: () => {
      setIsPending(true);
    },
  });

  const handleToggleDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDialog = () => {
    reset();
    setIsOpen(false);
    handleToggleDialog();
  };

  const onSubmit = async (data: { plateNumber: string }) => {
    try {
      await editCardMutation.mutateAsync(data, {
        onSuccess: (data) => {
          toast.success(data.data.message);
          reset();
          setIsOpen(false);
          refetch();
          setIsPending(false);
        },
        onError: (error) => {
          toast.error("Failed to edit card");
          setIsPending(false);
          refetch();
        },
      });
    } catch (error) {
      toast.error("Failed to edit card");
      setIsPending(false);
      refetch();
    }
  };

  return (
    <>
      {openConfirmDialog && (
        <AlertDialog
          open={openConfirmDialog}
          onCancel={handleToggleDialog}
          onConfirm={handleConfirmDialog}
          onOpenChange={handleToggleDialog}
          title='Cancel Edit card ?'
          content='By clicking OK will RESET and CLOSE this form ?'
        />
      )}
      <Button
        sx={{
          backgroundColor: "#3b82f6",
          color: "white",
          width: "80px",
          "&:disabled": {
            backgroundColor: "grey",
            color: "white",
          },
          "&:hover": {
            backgroundColor: "#2563eb",
          },
        }}
        onClick={() => setIsOpen(true)}
        disabled={disable}
      >
        Edit
      </Button>
      {isOpen && (
        <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
          <div className='pl-5 pr-5 pt-10 pb-10'>
            <div className='flex flex-col w-full space-y-5'>
              <h1 className='text-center font-semibold text-2xl'>Edit Card</h1>
              <FormProvider {...methods}>
                <form
                  className='flex flex-col space-y-2'
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <FormInput
                    name='plateNumber'
                    label='Plate Number'
                    placeholder='Enter Plate Number'
                    autoFocus={true}
                    defaultValue={value}
                  />
                  <Button type='submit' variant='contained' color='primary'>
                    Submit
                  </Button>
                </form>
              </FormProvider>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
