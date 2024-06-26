import { Dialog } from "@mui/material";
import { useRef } from "react";

interface ModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    onClose?: () => void;
    children: React.ReactNode;
}

export default function Modal({ open, setOpen, onClose = () => { }, children }: ModalProps) {
    let overlayRef = useRef<HTMLDivElement | null>(null);

    const handleClose = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            ref={overlayRef}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: '10px', // adjust this value to change the roundness of the corners
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // adjust these values to change the shadow
                    margin: 0,
                    maxHeight: "100vh",
                    maxWidth: "100vw",
                    overflow: "hidden",
                },
                "& .MuiBackdrop-root": {
                    backgroundColor: "rgba(75, 85, 99, 0.6)", // equivalent to bg-gray-800 with 60% opacity
                },
            }}
            className="fixed inset-0 z-10 flex items-center justify-center"
        >
            {children}
        </Dialog>
    )
}