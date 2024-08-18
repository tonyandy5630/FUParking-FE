import React from "react";

type Props = {
  children: any;
};
export default function SearchContainer({ children }: Props) {
  return (
    <div className='flex justify-start items-center py-2 gap-2'>{children}</div>
  );
}
