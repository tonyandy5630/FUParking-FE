'use client';
import Image from "next/image";
import { usePathname } from "next/navigation";
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    height: number;
}

export default function Header({ isOpen, setIsOpen, height }: HeaderProps) {
    const router = usePathname();
    let title;

    const segments = router.split('/');

    switch (segments[2]) {
        case "customer":
            title = "Customer";
            break;
        case "customer":
            title = "Customer";
            break;
        case "transaction":
            title = "Transaction";
            break;
        case "card":
            title = "Card";
            break;
        case "vehicle":
            title = "Vehicle";
            break;
        case "parking-area":
            title = "Parking Area";
            break;
        case "feedback":
            title = "Feedback";
            break;
        case "gate":
            title = "Gate";
            break;
        case "price":
            title = "Price";
            break;
        case "package":
            title = "Package";
            break;
        case "user":
            title = "User";
            break;
        case "vehicle-type":
            title = "Vehicle Type";
            break;
        default:
            title = "Dashboard";
            break;
    }

    return (
        <header
            className="flex flex-row items-center pl-5 gap-5 shadow-md"
            style={{ backgroundColor: '#111827', height: `${height}px` }}
        >
            <IconButton onClick={() => setIsOpen(!isOpen)} color="warning">
                <MenuIcon />
            </IconButton>
            <div className="flex flex-row justify-center items-center">
                <Image src="/bai_logo.svg" alt="Bai Logo" width={60} height={60} />
                <p
                    className="text-2xl font-bold text-white ml-4"
                >{title}</p>
            </div>
        </header>
    )
}