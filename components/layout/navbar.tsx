'use client';
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

interface LeftNavbarProps {
  menu: {
    name: string;
    path: string;
  }[];
}

export default function LeftNavbar() {
  const router = usePathname();
  const menuManager: LeftNavbarProps['menu'] = [
    {
      name: 'Dashboard',
      path: '/manager'
    },
    {
      name: 'Customer',
      path: '/manager/customer'
    },
    {
      name: 'Card',
      path: '/manager/card'
    },
    {
      name: 'Transaction',
      path: '/manager/transaction'
    },
    {
      name: 'Vehicle',
      path: '/manager/vehicle'
    },
    {
      name: 'Parking Area',
      path: '/manager/parking-area'
    },
    {
      name: 'Feedback',
      path: '/manager/feedback'
    },
    {
      name: 'Gate',
      path: '/manager/gate'
    },
    {
      name: 'Price',
      path: '/manager/price'
    },
    {
      name: 'Package',
      path: '/manager/package'
    },
    {
      name: 'User',
      path: '/manager/user'
    },
    {
      name: 'Vehicle Type',
      path: '/manager/vehicle-type'
    }
  ]

  return (
    <div className="flex flex-col w-64 h-full text-white p-5 space-y-3">
      {menuManager.map((item, index) => (
        <Link href={item.path} key={index}
          className={`flex items-center justify-start w-full p-2 hover:bg-gray-700 rounded-lg cursor-pointer ${router === item.path ? 'bg-gray-700' : ''}`}
        >
          <p className={`hover:text-orange-500 ${router === item.path ? 'text-orange-500' : ''}`}>
            {item.name}
          </p>
        </Link>
      ))}
    </div>
  )
}
