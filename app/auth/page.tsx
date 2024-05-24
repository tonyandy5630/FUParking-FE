import React from "react";
import Image from "next/image";
import LoginForm from "@/components/Page/Auth/LoginForm";

export default function Page() {
  return (
    <main className='flex flex-col justify-center w-full items-center p-14 h-full space-y-5'>
      <Image
        src='/Bai_Logo.svg'
        alt='logo'
        width={150}
        height={150}
        className='p-1.5'
      />
      <div className='text-center'>
        <span
          className='text-3xl p-2 font-semibold'
          style={{ color: "#f37021" }}
        >
          Sign in to your account
        </span>
      </div>
      <LoginForm />
    </main>
  );
}
