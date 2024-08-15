"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useMemo, useState } from "react";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  height: number;
}

export default function Header({ isOpen, setIsOpen, height }: HeaderProps) {
  const pathname = usePathname();

  const title = useMemo(() => {
    const segments = pathname.split("/");
    switch (segments[2]) {
      case "customer":
        return "Customer";
      case "customer":
        return "Customer";
      case "transaction":
        return "Transaction";
      case "card":
        return "Card";
      case "vehicle":
        return "Vehicle";
      case "parking-area":
        return "Parking Area";
      case "feedback":
        return "Feedback";
      case "gate":
        return "Gate";
      case "price":
        return "Price";
      case "package":
        return "Package";
      case "user":
        return "User";
      case "vehicle-type":
        return "Vehicle Type";
      default:
        return "Dashboard";
    }
  }, [pathname]);

  return (
    <header
      className='flex flex-row items-center pl-5 gap-5 shadow-md'
      style={{ backgroundColor: "#111827", height: `${height}px` }}
    >
      <IconButton onClick={() => setIsOpen(!isOpen)} color='warning'>
        <MenuIcon />
      </IconButton>
      <div className='flex flex-row justify-center items-center'>
        <Image src='/bai_logo.svg' alt='Bai Logo' width={60} height={60} />
        <p className='text-2xl font-bold text-white ml-4'>{title}</p>
      </div>
    </header>
  );
}
