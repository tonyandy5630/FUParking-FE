import React from "react";
type Props = {
  children: any;
};
export default function DialogActionWithDelete({ children }: Props) {
  return <div className=' flex justify-between items-center'>{children}</div>;
}
