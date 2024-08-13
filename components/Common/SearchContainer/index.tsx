import React from "react";

type Props = {
  children: any;
};
export default function SearchContainer({ children }: Props) {
  return <div className='flex flex-row gap-3 justify-center'>{children}</div>;
}
