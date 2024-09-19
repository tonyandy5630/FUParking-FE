"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/DropdownMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/Avatar";
import logo from "@/public/Bai_Logo.svg";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  height: number;
  fullName: string;
}

export default function Header({
  isOpen,
  setIsOpen,
  height,
  fullName,
}: HeaderProps) {
  const pathname = usePathname();
  const logOut = () => {
    // clear token'
    localStorage.removeItem("access_token");
    window.location.href = "/auth";
  };

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
      className="flex flex-row items-center pl-5 justify-between pr-10"
      style={{ backgroundColor: "#111827", height: `${height}px` }}
    >
      <div className="flex flex-row items-center gap-5">
        <IconButton onClick={() => setIsOpen(!isOpen)} color="warning">
          <MenuIcon />
        </IconButton>
        <div className="flex flex-row justify-center items-center">
          <Image src={logo} alt="Bai Logo" width={60} height={60} />
          <p className="text-2xl font-bold text-white ml-4">{title}</p>
        </div>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{fullName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
