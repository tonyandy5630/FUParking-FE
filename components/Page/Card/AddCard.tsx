import { addCardAPI } from "@/api/card";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import { ListCardResponse } from "@/types/card.type";
import AddCardSchema, { AddCardSchemaType } from "@/utils/schemas/card/createCardSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl } from "@mui/material";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AddCard({ setIsPending, disable, refetch }: { setIsPending: (isPending: boolean) => void, disable: boolean, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ListCardResponse, any>, Error>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }

    const methods = useForm<AddCardSchemaType>({
        defaultValues: {
            cardNumber: "",
            plateNumber: "",
        },
        resolver: yupResolver(AddCardSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = methods;

    const addCardMutation = useMutation({
        mutationKey: ["/cards"],
        mutationFn: addCardAPI,
        onMutate: () => {
            setIsPending(true);
        }
    });

    const onSubmit = async (data: { cardNumber: string; plateNumber?: string | undefined }) => {
        try {
            await addCardMutation.mutateAsync(data, {
                onSuccess: (data) => {
                    toast.success(data.data.message);
                    reset();
                    setIsOpen(false);
                    refetch();
                    setIsPending(false);
                },
                onError: (error) => {
                    toast.error('Failed to add card');
                    setIsPending(false);
                    refetch();
                }
            });
        } catch (error) {
            toast.error('Failed to add card');
            reset();
            setIsPending(false);
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                disabled={disable}
                onClick={() => setIsOpen(true)}
            >
                Add Card
            </Button>
            <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
                <div className="pl-5 pr-5 pt-10 pb-10">
                    <Button
                        onClick={handleClose} sx={
                            {
                                position: 'absolute',
                                padding: '0',
                                margin: '10px',
                                width: '0',
                                right: '0',
                                top: '0',
                                color: 'black',
                                border: '1px solid black',
                                backgroundColor: 'white',
                                '&:hover': {
                                    backgroundColor: 'white',
                                }
                            }
                        }>
                        X
                    </Button>
                    <div className="flex flex-col w-full space-y-5">
                        <h1 className="text-center font-semibold text-2xl">Create new Customer</h1>
                        <FormProvider {...methods}>
                            <FormControl>
                                <form
                                    className="flex flex-col space-y-2"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <FormInput
                                        name="cardNumber"
                                        label="Card Number"
                                        placeholder='Enter Card Number'
                                        autofocus={true}
                                        key="cardNumber"
                                    />
                                    {
                                        errors.cardNumber && (
                                            <p className="text-red-500">{errors.cardNumber.message}</p>
                                        )
                                    }
                                    <FormInput
                                        name="plateNumber"
                                        label="Plate Number"
                                        placeholder="Enter Plate Number"
                                        key="plateNumber"
                                    />
                                    {
                                        errors.plateNumber && (
                                            <p className="text-red-500">{errors.plateNumber.message}</p>
                                        )
                                    }
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit
                                    </Button>
                                </form>
                            </FormControl>
                        </FormProvider>
                    </div>
                </div>
            </Modal>
        </>
    );
}
