import { BLOCK_LIMIT_MESSAGE, MODE_LIMIT_MESSAGE } from "@/constant/message";
import { UseFormGetValues } from "react-hook-form";

const MIN_MODE = 1;
const MAX_MODE = 5;

const MIN_BLOCK = 0;
const MAX_BLOCK = 9999;

export const getParkingAreaRules = (getValues?: UseFormGetValues<any>) => ({
  mode: {
    min: {
      value: MIN_MODE,
      message: MODE_LIMIT_MESSAGE,
    },
    max: {
      value: MAX_MODE,
      message: MODE_LIMIT_MESSAGE,
    },
  },
  block: {
    min: {
      value: MIN_BLOCK,
      message: BLOCK_LIMIT_MESSAGE,
    },
    max: {
      value: MAX_BLOCK,
      message: BLOCK_LIMIT_MESSAGE,
    },
  },
  maxCapacity: {
    min: {
      value: 0,
      message: "Minimum is 0",
    },
  },
});
