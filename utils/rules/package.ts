import { GREATER_0_MESSAGE } from "@/constant/message";
import { UseFormGetValues } from "react-hook-form";

export const getPackageRules = (getValues?: UseFormGetValues<any>) => ({
  coinAmount: {
    min: {
      value: 0,
      message: GREATER_0_MESSAGE,
    },
  },
  extraCoin: {
    min: {
      value: 0,
      message: GREATER_0_MESSAGE,
    },
  },
  expPackage: {
    min: {
      value: 0,
      message: GREATER_0_MESSAGE,
    },
  },
  price: {
    min: {
      value: 1000,
      message: GREATER_0_MESSAGE,
    },
  },
});
