import { object, string, InferType, number, date } from "yup";
import getRules from "../rules/price-table";
import {
  MIN_MAX_PRICE_OVERLAP,
  MUST_BE_NUMBER_MESSAGE,
  REQUIRED_MESSAGE,
} from "@/constant/message";

const { name, priority, price } = getRules();

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
    .min(price.min.value, price.min.message)
    .required(REQUIRED_MESSAGE),
  maxPrice: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(REQUIRED_MESSAGE)
    .min(price.min.value, price.min.message),
  minPrice: number()
    .required(REQUIRED_MESSAGE)
    .min(price.min.value, price.min.message)
    .integer(MUST_BE_NUMBER_MESSAGE)
    .when("maxPrice", ([maxPrice], schema) =>
      maxPrice ? schema.max(maxPrice, MIN_MAX_PRICE_OVERLAP) : schema
    ),
});

export type PriceTableTableSchemaType = InferType<typeof PriceTableTableSchema>;
export default PriceTableTableSchema;
