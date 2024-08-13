import React from "react";

type Props = {
  children: any;
};
export default function PageTitle({ children }: any) {
  return (
    <>
      <h1 className='text-2xl font-semibold text-center'>{children}</h1>
    </>
  );
}
