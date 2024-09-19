import { GREATER_0_MESSAGE } from "@/constant/message";
import { UseFormGetValues } from "react-hook-form";

const NAME_MAX_LENGTH = 50;
const MIN_PRICE = 100;
const MIN_PRIORITY = 2;
const MAX_PRIORITY = 5;

const getRules = (getValues?: UseFormGetValues<any>) => ({
  name: {
    maxLength: {
      value: NAME_MAX_LENGTH,
      message: "Maximum length is " + NAME_MAX_LENGTH,
    },
  },
  priority: {
    min: {
      value: MIN_PRIORITY,
      message: "Min priority is " + MIN_PRIORITY,
    },
    max: {
      value: MAX_PRIORITY,
      message: "Max priority is " + MAX_PRIORITY,
    },
  },
  price: {
    min: {
      value: MIN_PRICE,
      message: GREATER_0_MESSAGE,
    },
  },
});

export default getRules;
