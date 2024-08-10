"use client";
import porter from "@/public/Bai_poster.png";
import Image from "next/image";

export default function Revenue() {
  return (
    <div className="flex max-w-4xl rounded-md border shadow-lg bg-white items-center justify-around pl-5 pr-5 gap-5" style={{minWidth:"645px"}}>
      <div className="flex flex-col items-start justify-center gap-2">
        <p className="text-wrap">Total revenue</p>
        <p className="text-3xl font-extrabold">10,000,000,000</p>
        <p style={{color: '#D9D9D9'}}>Update: 08:20 08/10/2024</p>
      </div>
      <p>
        <Image src={porter} alt="Total revenue" width={200} height={142}/>
      </p>
    </div>
  );
}
