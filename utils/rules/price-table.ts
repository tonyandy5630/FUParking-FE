import { UseFormGetValues } from "react-hook-form";

const NAME_MAX_LENGTH = 50;

const getRules = (getValues?: UseFormGetValues<any>) => ({
  name: {
    maxLength: {
      value: NAME_MAX_LENGTH,
      message: "Maximum length is " + NAME_MAX_LENGTH,
    },
  },
});

export default getRules;
