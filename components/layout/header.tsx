'use client';
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
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
            className="flex flex-row items-center p-2.5 bg-white shadow-md"
            style={{ backgroundColor: '#111827' }}
        >
            <Image src="/Bai_logo.svg" alt="Bai Logo" width={60} height={60} />
            <p
                className="text-2xl font-bold text-white ml-4"
            >{title}</p>
        </header>
    )
}