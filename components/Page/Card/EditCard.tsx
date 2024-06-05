import { editCardAPI } from "@/api/card";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import { ListCardResponse } from "@/types/card.type";
import EditCardSchema, { EditCardSchemaType } from "@/utils/schemas/card/editCardSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl } from "@mui/material";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EditCard({ id, setIsPending, disable, refetch }: { id: string, setIsPending: (isPending: boolean) => void, disable: boolean, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ListCardResponse, any>, Error>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    const methods = useForm<EditCardSchemaType>({
        defaultValues: {
            plateNumber: "",
        },
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
        }
    });
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
                    toast.error('Failed to edit card');
                    setIsPending(false);
                    refetch();
                }
            });
        } catch (error) {
            toast.error('Failed to edit card');
            setIsPending(false);
            refetch();
        }
    }

    return (
        <>
            <Button
                sx={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    width: '80px',
                    '&:disabled': {
                        backgroundColor: 'grey',
                        color: 'white',
                    },
                    '&:hover': {
                        backgroundColor: '#2563eb',
                    }
                }}
                onClick={() => setIsOpen(true)}
                disabled={disable}
            >
                Edit
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
                                        name="plateNumber"
                                        label="Plate Number"
                                        placeholder='Enter Plate Number'
                                        autofocus={true}
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