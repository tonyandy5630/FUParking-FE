import { createVehicleTypeAPI } from "@/api/vehicleType";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import { ListVehicleTypeResponse } from "@/types/vehicleType.type";
import CreateVehicleTypeSchema, { CreateVehicleTypeSchemaType } from "@/utils/schemas/vehicleType/createVehicleType";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl } from "@mui/material";
import { RefetchOptions, QueryObserverResult, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function CreateVehicleType({ setIsPending, disable, refetch }: { setIsPending: (isPending: boolean) => void, disable: boolean, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ListVehicleTypeResponse, any>, Error>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    const methods = useForm<CreateVehicleTypeSchemaType>({
        defaultValues: {
            name: "",
            description: "",
        },
        resolver: yupResolver(CreateVehicleTypeSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = methods;

    const createVehicleTypeMutation = useMutation({
        mutationKey: ["/vehicleTypes"],
        mutationFn: createVehicleTypeAPI,
        onMutate: () => {
            setIsPending(true);
        }
    });

    const onSubmit = async (data: { name: string; description?: string | undefined }) => {
        try {
            await createVehicleTypeMutation.mutateAsync(data, {
                onSuccess: (data) => {
                    toast.success(data.data.message);
                    reset();
                    setIsOpen(false);
                    refetch();
                    setIsPending(false);
                },
                onError: (error) => {
                    toast.error('Failed to create vehicle type');
                    setIsPending(false);
                    refetch();
                }
            });
        } catch (error) {
            toast.error('Failed to create vehicle type');
            reset();
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
                Create Vehicle Type
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
                        <h1 className="text-center font-semibold text-2xl">Create new Customer</h1>
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