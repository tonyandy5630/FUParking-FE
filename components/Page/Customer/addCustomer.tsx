import { addCustomerAPI } from "@/api/customer";
import FormInput from "@/components/Form/Input";
import Modal from "@/components/modal/modal";
import { ListCustomerWithFillerReponse } from "@/types/customer.type";
import NewCustomerSchema, { NewCustomerSchemaType } from "@/utils/schemas/newCustomerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormControl } from "@mui/material";
import { QueryObserverResult, RefetchOptions, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AddCustomer({ disabled, refetch }: { disabled: boolean, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ListCustomerWithFillerReponse, any>, Error>> }) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => {
        setIsOpen(false);
    }
    const methods = useForm<NewCustomerSchemaType>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
        resolver: yupResolver(NewCustomerSchema),
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = methods;

    const addCustomerMutation = useMutation({
        mutationKey: ["/customers/free"],
        mutationFn: addCustomerAPI,
    });

    const onSubmit = async (data: { name: string; email: string; phone?: string | undefined }) => {
        try {
            await addCustomerMutation.mutateAsync(data, {
                onSuccess: (data) => {
                    toast.success(data.data.message);
                    reset();
                    setIsOpen(false);
                    refetch();
                },
            });
        } catch (error) {
            reset();
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                disabled={disabled}
                onClick={() => setIsOpen(true)}
            >
                Add Customer
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
                                        name="name"
                                        label="Full Name"
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
                                        name="email"
                                        label="Email"
                                        placeholder="Enter Email"
                                        key="email"
                                    />
                                    {
                                        errors.email && (
                                            <p className="text-red-500">{errors.email.message}</p>
                                        )
                                    }
                                    <FormInput
                                        name="phone"
                                        label="Phone"
                                        placeholder="Enter Phone"
                                        key="phone"
                                    />
                                    {
                                        errors.phone && (
                                            <p className="text-red-500">{errors.phone.message}</p>
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