import { GREATER_0_MESSAGE } from "@/constant/message";
import { UseFormGetValues } from "react-hook-form";

const MIN_PASSWORD = 8;
export const getSystemUserRule = (getValues?: UseFormGetValues<any>) => ({
  password: {
    min: {
      value: MIN_PASSWORD,
      message: "Password must 8 character or more",
    },
  },
});
