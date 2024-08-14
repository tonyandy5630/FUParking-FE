import { GREATER_0_MESSAGE, HOUR_LIMIT_MESSAGE } from "@/constant/message";
import { UseFormGetValues } from "react-hook-form";

const MIN_FROM_HOUR = 0;
const MAX_FROM_HOUR = 24;
const MIN_PRICE = 0;

const getPriceItemRules = (getValues?: UseFormGetValues<any>) => ({
  from: {
    min: {
      value: MIN_FROM_HOUR,
      message: HOUR_LIMIT_MESSAGE,
    },
    max: {
      value: MAX_FROM_HOUR,
      message: HOUR_LIMIT_MESSAGE,
    },
  },
  to: {
    min: {
      value: MIN_FROM_HOUR,
      message: HOUR_LIMIT_MESSAGE,
    },
    max: {
      value: MAX_FROM_HOUR,
      message: HOUR_LIMIT_MESSAGE,
    },
  },
  price: {
    min: {
      value: MIN_PRICE,
      message: GREATER_0_MESSAGE,
    },
  },
});

export default getPriceItemRules;
