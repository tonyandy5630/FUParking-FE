import { updateVehicleTypeAPI } from "@/api/vehicleType";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import { ListVehicleTypeResponse } from "@/types/vehicleType.type";
import EditVehicleTypeSchema, { EditVehicleTypeSchemaType } from "@/utils/schemas/vehicleType/editVehicleType";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl } from "@mui/material";
import { RefetchOptions, QueryObserverResult, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function EditVehicleType({ id, setIsPending, disable, refetch }: { id: string, setIsPending: (isPending: boolean) => void, disable: boolean, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ListVehicleTypeResponse, any>, Error>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    const methods = useForm<EditVehicleTypeSchemaType>({
        defaultValues: {
            name: "",
            description: "",
        },
        resolver: yupResolver(EditVehicleTypeSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = methods;

    const editVehicleTypeMutation = useMutation({
        mutationKey: ["/vehicleTypes"],
        mutationFn: (data: { name?: string | undefined; description?: string | undefined }) => updateVehicleTypeAPI(id, data),
        onMutate: () => {
            setIsPending(true);
        }
    });

    const onSubmit = async (data: { name?: string | undefined; description?: string | undefined }) => {
        try {
            if (!data.name && !data.description) {
                setError("description", {
                    type: "manual",
                    message: "Either name or description must be provided",
                });
                return;
            }
            await editVehicleTypeMutation.mutateAsync(data, {
                onSuccess: (data) => {
                    toast.success(data.data.message);
                    reset();
                    setIsOpen(false);
                    refetch();
                    setIsPending(false);
                },
                onError: () => {
                    toast.error('Failed to edit vehicle type');
                    setIsPending(false);
                    refetch();
                }
            });
        } catch (error) {
            toast.error('Failed to edit vehicle type');
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
                        }
                        aria-label="Close"
                    >
                        X
                    </Button>
                    <div className="flex flex-col w-full space-y-5">
                        <h1 className="text-center font-semibold text-2xl">Edit Vehicle Type</h1>
                        <FormProvider {...methods}>
                            <FormControl>
                                <form
                                    className="flex flex-col space-y-2"
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    <FormInput
                                        name="name"
                                        label="Name Vehicle Type"
                                        placeholder='Enter Name'
                                        autofocus={true}
                                        key="name"
                                    />
                                    {
                                        errors.name && (
                                            <p className="text-red-500">{errors.name.message}</p>
                                        )
                                    }
                                    <FormInput
                                        name="description"
                                        label="Description"
                                        placeholder="Enter description"
                                        key="description"
                                    />
                                    {
                                        errors.description && (
                                            <p className="text-red-500">{errors.description.message}</p>
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
    )
}