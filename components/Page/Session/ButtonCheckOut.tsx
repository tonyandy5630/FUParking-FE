import { checkOutAPI } from "@/api/session";
import Modal from "@/components/modal/modal";
import { Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ButtonCheckOut({ plateNumber, timeOut, setIsOpen, isOpen  }: { plateNumber: string, timeOut: string, setIsOpen: (isOpen: boolean) => void, isOpen: boolean, }) {   
    const handleClickButton = () => {
        setIsOpen(true);
    }

    let setTypeOfCustomer;
    let setMoneyNeedToPay;
    let imageIn;

    const closeSession = useMutation({
        mutationKey: ['/session/close', plateNumber, timeOut],
        mutationFn: () => checkOutAPI({plateNumber, timeOut}),
    })

    const handleClose = () => {
        setIsOpen(false);
    }

    const onSubmit = async (data: any) => { 
        try {
            await closeSession.mutateAsync(data, {
                onSuccess: (data) => {                    
                    setTypeOfCustomer = data.data.data?.typeOfCustomer as string;
                    setMoneyNeedToPay = data.data.data?.amount as number;
                    imageIn = data.data.data?.imageInUrl as string;                
            },
                onError: (error) => {
                    toast.error('Failed to get data');
                }});            
        } catch (error) {
            toast.error('Failed to get data');
        }
    }
    return (
        <>
            <Button 
                onClick={() => {
                    handleClickButton();
                    onSubmit({ timeOut, plateNumber });
                }}
                variant="contained"
                color="primary"                
            >
                Check Out
            </Button>
            <Modal open={isOpen} setOpen={setIsOpen}>
                <div className="pl-5 pr-5 pt-10 pb-10">
                    <Button
                        onClick={() => handleClose()} sx={
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
                    <p>Session Parking Location: {plateNumber}</p>
                    <p>Session Image In:</p>
                    <Image src={imageIn as unknown as string} alt="session image in" width="200" height="200" className="rounded-lg"/>                    
                    <p>Type of Customer: {setTypeOfCustomer}</p>
                    <p>Money Need to Pay: {setMoneyNeedToPay}</p>
                </div>
            </Modal>
        </>        
    )
}