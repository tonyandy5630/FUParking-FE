"use client";
import Link from "next/link";
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import LocalParkingTwoToneIcon from "@mui/icons-material/LocalParkingTwoTone";
import ChatTwoToneIcon from "@mui/icons-material/ChatTwoTone";
import CameraRearTwoToneIcon from "@mui/icons-material/CameraRearTwoTone";
import PriceChangeTwoToneIcon from "@mui/icons-material/PriceChangeTwoTone";
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import PersonOutlineTwoToneIcon from "@mui/icons-material/PersonOutlineTwoTone";
import MinorCrashTwoToneIcon from "@mui/icons-material/MinorCrashTwoTone";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Tooltip from "@mui/material/Tooltip";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface LeftNavbarProps {
  menu: {
    name: string;
    path: string;
    icon: React.ElementType;
  }[];
}

const menuSupervisor: LeftNavbarProps["menu"] = [
  {
    name: "Dashboard",
    path: "/supervisor",
    icon: GridViewRoundedIcon,
  },
  {
    name: "Revenue",
    path: "/supervisor/revenue",
    icon: AttachMoneyIcon,
  },
  {
    name: "Customer",
    path: "/supervisor/customer",
    icon: AccountCircleOutlinedIcon,
  },
  {
    name: "Card",
    path: "/supervisor/card",
    icon: CreditCardOutlinedIcon,
  },
  {
    name: "Transaction",
    path: "/supervisor/transaction",
    icon: AssessmentIcon,
  },
  {
    name: "Vehicle",
    path: "/supervisor/vehicle",
    icon: TwoWheelerOutlinedIcon,
  },
  {
    name: "Parking Area",
    path: "/supervisor/parking-area",
    icon: LocalParkingTwoToneIcon,
  },
  {
    name: "Session",
    path: "/supervisor/session",
    icon: ReceiptOutlinedIcon,
  },
  {
    name: "Feedback",
    path: "/supervisor/feedback",
    icon: ChatTwoToneIcon,
  },
  {
    name: "Package",
    path: "/supervisor/package",
    icon: Inventory2TwoToneIcon,
  },
  {
    name: "Vehicle Type",
    path: "/supervisor/vehicle-type",
    icon: MinorCrashTwoToneIcon,
  },
];

export default function NavbarSupervisor({ open = true }: { open?: boolean }) {
  const router = usePathname();
  const menu = useMemo(() => {
    return menuSupervisor.map((item, index) => (
      <Link
        href={item.path}
        key={index}
        className={`flex items-center justify-start w-full p-2 hover:bg-gray-700 rounded-lg cursor-pointer ${
          router === item.path ? "bg-gray-700" : ""
        }`}
      >
        {!open ? (
          <Tooltip title={item.name}>
            <item.icon
              className={`mr-2 hover:text-orange-500 ${
                router === item.path ? "text-orange-500" : ""
              }`}
            />
          </Tooltip>
        ) : (
          <item.icon
            className={`mr-2 hover:text-orange-500 ${
              router === item.path ? "text-orange-500" : ""
            }`}
          />
        )}
        {open && (
          <p
            className={`hover:text-orange-500 ${
              router === item.path ? "text-orange-500" : ""
            }`}
          >
            {item.name}
          </p>
        )}
      </Link>
    ));
  }, [router, open]);
  return (
    <div
      className={`flex flex-col ${
        open ? "w-56" : "w-20"
      } h-full text-white p-5 space-y-3 transition-all duration-200`}
      style={{
        overflow: "auto",
        scrollbarWidth: "none" /* For Firefox */,
        msOverflowStyle: "none" /* For IE and Edge */,
      }}
    >
      {menu}
    </div>
  );
}
