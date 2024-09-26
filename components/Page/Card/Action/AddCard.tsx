import { addCardAPI } from "@/api/card";
import Modal from "@/components/modal/modal";
import { CARD_NUMBER_EXISTED, PLATE_NUMBER_EXISTED } from "@/constant/message";
import AddCardSchema from "@/utils/schemas/card/createCardSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { KeyboardEventHandler, useState } from "react";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { DialogProps } from "@/types/dialog.type";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FormInput from "@/components/Form/Input";
import ComboFormButton from "@/components/Dialog/ComboButton";

interface CardProps {
  cardNumber: string;
}

interface FormData {
  cardNumbers: CardProps[];
}

export default function AddCard({
  open,
  onClose,
  onOpenChange,
  refetch,
}: DialogProps & {
  refetch: () => void;
}) {
  const methods = useForm<FormData>({
    resolver: yupResolver(AddCardSchema),
    defaultValues: {
      cardNumbers: [{ cardNumber: "" }],
    },
  });

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
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "cardNumbers",
  });

  const { mutateAsync: createCardAsync } = useMutation({
    mutationKey: ["/add-cards"],
    mutationFn: addCardAPI,
  });

  const handleCreateCard = async (formData: FormData) => {
    const cardData = {
      cardNumbers: formData.cardNumbers.map((card) => card.cardNumber),
    };
    try {
      await createCardAsync(cardData, {
        onSuccess: () => {
          toast.success("Create card successfully");
          refetch();
          reset();
          onClose && onClose();
        },
      });
    } catch (error: any) {
      if (error.response.status === 400) {
        if (error.response.data.message === CARD_NUMBER_EXISTED) {
          setError("cardNumbers", {
            type: "manual",
            message: CARD_NUMBER_EXISTED,
          });
        } else if (error.response.data.message === PLATE_NUMBER_EXISTED) {
          setError("cardNumbers", {
            type: "manual",
            message: PLATE_NUMBER_EXISTED,
          });
        }
      }
    }
  };

  const handleClose = () => {
    if (isDirty && Object.keys(dirtyFields).length > 0) {
      setShowConfirmDialog(true);
    } else {
      onClose && onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    onClose && onClose();
  };

  const checkKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.code === "Enter") e.preventDefault();
  };

  return (
    <>
      <Modal onClose={handleClose} open={open} setOpen={onOpenChange}>
        <div className="pl-5 pr-5 pt-5 pb-5">
          <DialogTitle>Create card</DialogTitle>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(handleCreateCard)}
              onKeyDown={checkKeyDown}
            >
              <DialogContent
                sx={{
                  maxHeight: "70vh",
                  width: "30vw",
                }}
              >
                <Grid container spacing={1.5}>
                  {fields.map((field, index) => (
                    <Grid
                      item
                      xs={12}
                      container
                      alignItems={"center"}
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
                            onClick={() => append({ cardNumber: "" })}
                          >
                            <AddIcon />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item xs={10.5}>
                        <FormControl fullWidth>
                          <FormInput
                            name={`cardNumbers[${index}].cardNumber`} // Adjusted name to match the array structure
                            label="Card number"
                            placeholder="Card number"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  ))}
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
