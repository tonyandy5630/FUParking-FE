import React from "react";

export default function ActionArea({ children }: { children: any }) {
  return (
    <div className='min-w-full flex justify-start items-center py-2'>
      {children}
    </div>
  );
}
