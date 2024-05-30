'use client';
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
import LocalParkingTwoToneIcon from '@mui/icons-material/LocalParkingTwoTone';
import ChatTwoToneIcon from '@mui/icons-material/ChatTwoTone';
import CameraRearTwoToneIcon from '@mui/icons-material/CameraRearTwoTone';
import PriceChangeTwoToneIcon from '@mui/icons-material/PriceChangeTwoTone';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import MinorCrashTwoToneIcon from '@mui/icons-material/MinorCrashTwoTone';
import Tooltip from '@mui/material/Tooltip';

interface LeftNavbarProps {
  menu: {
    name: string;
    path: string;
    icon: React.ElementType;
  }[];
}

export default function LeftNavbar({ open = true }: { open?: boolean }) {
  const router = usePathname();
  const menuManager: LeftNavbarProps['menu'] = [
    {
      name: 'Dashboard',
      path: '/manager',
      icon: GridViewRoundedIcon,
    },
    {
      name: 'Customer',
      path: '/manager/customer',
      icon: AccountCircleOutlinedIcon,
    },
    {
      name: 'Card',
      path: '/manager/card',
      icon: CreditCardOutlinedIcon,
    },
    {
      name: 'Transaction',
      path: '/manager/transaction',
      icon: ReceiptOutlinedIcon,
    },
    {
      name: 'Vehicle',
      path: '/manager/vehicle',
      icon: TwoWheelerOutlinedIcon,
    },
    {
      name: 'Parking Area',
      path: '/manager/parking-area',
      icon: LocalParkingTwoToneIcon,
    },
    {
      name: 'Feedback',
      path: '/manager/feedback',
      icon: ChatTwoToneIcon,
    },
    {
      name: 'Gate',
      path: '/manager/gate',
      icon: CameraRearTwoToneIcon,
    },
    {
      name: 'Price',
      path: '/manager/price',
      icon: PriceChangeTwoToneIcon,
    },
    {
      name: 'Package',
      path: '/manager/package',
      icon: Inventory2TwoToneIcon,
    },
    {
      name: 'User',
      path: '/manager/user',
      icon: PersonOutlineTwoToneIcon,
    },
    {
      name: 'Vehicle Type',
      path: '/manager/vehicle-type',
      icon: MinorCrashTwoToneIcon,
    }
  ]

  return (
    <div className={`flex flex-col ${open ? 'w-56' : 'w-20'} h-full text-white p-5 space-y-3 transition-all duration-200`}>
      {menuManager.map((item, index) => (
        <Link href={item.path} key={index}
          className={`flex items-center justify-start w-full p-2 hover:bg-gray-700 rounded-lg cursor-pointer ${router === item.path ? 'bg-gray-700' : ''}`}
        >
          {!open ? (
            <Tooltip title={item.name}>
              <item.icon className={`mr-2 hover:text-orange-500 ${router === item.path ? 'text-orange-500' : ''}`} />
            </Tooltip>
          ) : (
            <item.icon className={`mr-2 hover:text-orange-500 ${router === item.path ? 'text-orange-500' : ''}`} />
          )}
          {open && <p className={`hover:text-orange-500 ${router === item.path ? 'text-orange-500' : ''}`}>
            {item.name}
          </p>}
        </Link>
      ))}
    </div>
  )
}
