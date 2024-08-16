import React from "react";

type Props = {
  children: any;
};
export default function SearchContainer({ children }: Props) {
  return (
    <div className='flex  gap-3 justify-start items-center py-2'>
      {children}
    </div>
  );
}
