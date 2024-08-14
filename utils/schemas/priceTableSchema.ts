import { object, string, InferType, number, date } from "yup";
import getRules from "../rules/price-table";
import { MUST_BE_NUMBER_MESSAGE, REQUIRED_MESSAGE } from "@/constant/message";

const { name, priority } = getRules();

const PriceTableTableSchema = object({
  vehicleTypeId: string().required(REQUIRED_MESSAGE),
  priority: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(priority.min.value, priority.min.message)
    .max(priority.max.value, priority.max.message)
    .required(REQUIRED_MESSAGE)
    .integer(MUST_BE_NUMBER_MESSAGE),
  name: string()
    .required(REQUIRED_MESSAGE)
    .max(name.maxLength.value, name.maxLength.message),
  applyFromDate: date(),
  applyToDate: date().when("applyFromDate", ([applyFromDate], schema) => {
    return applyFromDate
      ? schema.min(applyFromDate, "End date is before Start date")
      : schema;
  }),
  pricePerBlock: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(REQUIRED_MESSAGE),
  maxPrice: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(REQUIRED_MESSAGE)
    .integer(MUST_BE_NUMBER_MESSAGE),
  minPrice: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(REQUIRED_MESSAGE)
    .integer(MUST_BE_NUMBER_MESSAGE),
});

export type PriceTableTableSchemaType = InferType<typeof PriceTableTableSchema>;
export default PriceTableTableSchema;
