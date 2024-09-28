import { object, string, InferType, number, date, array } from "yup";
import getRules from "../rules/price-table";
import {
  MIN_MAX_PRICE_OVERLAP,
  MUST_BE_NUMBER_MESSAGE,
  REQUIRED_MESSAGE,
} from "@/constant/message";
import { utcTransform } from "../date";
import moment, { Moment } from "moment";

const { name, priority, price } = getRules();

const PriceItemSchema = object({
  from: number()
    .min(0, "Price must be greater than 0")
    .required(REQUIRED_MESSAGE)
    .max(24, "Price must be less than 24"),
  to: number()
    .min(0, "Price must be greater than 0")
    .required(REQUIRED_MESSAGE)
    .max(24, "Price must be less than 24"),
  minPrice: number().required(REQUIRED_MESSAGE),
  maxPrice: number().when("minPrice", ([minPrice], schema) =>
    minPrice
      ? schema.min(minPrice, "Max price must be greater than min price")
      : schema
  ),
  blockPricing: number()
    .min(0, "Price must be greater than 0")
    .required(REQUIRED_MESSAGE),
});

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
  applyFromDate: date()
    .transform((value, originalValue, context) => {
      const formats = "DD/MM/YYYY";
      // check to see if the previous transform already parsed the date
      // if (context.isType(value)) return moment(originalValue).format(formats);

      // the default coercion failed so let's try it with Moment.js instead
      value = moment.utc(originalValue);

      // if it's valid return the date object, otherwise return an `InvalidDate`
      return value.isValid() ? value.toDate() : new Date("");
    })
    .nullable(),
  applyToDate: date()
    .nullable()
    .when("applyFromDate", ([applyFromDate], schema) => {
      return applyFromDate !== null && applyFromDate
        ? schema.min(applyFromDate, "End date is before Start date")
        : schema;
    }),
  pricePerBlock: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(price.min.value, price.min.message)
    .required(REQUIRED_MESSAGE),
  maxPrice: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(price.min.value, price.min.message),
  minPrice: number()
    .required(REQUIRED_MESSAGE)
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(price.min.value, price.min.message)
    .integer(MUST_BE_NUMBER_MESSAGE)
    .when("maxPrice", ([maxPrice], schema) =>
      maxPrice ? schema.max(maxPrice, MIN_MAX_PRICE_OVERLAP) : schema
    ),
  priceItems: array().of(PriceItemSchema).optional(),
});

export type PriceTableTableSchemaType = InferType<typeof PriceTableTableSchema>;
export default PriceTableTableSchema;

export const UpdatePriceTableSchema = object({
  priceTableId: string().required("CANNOT FIND TABLE"),
  name: string()
    .trim()
    .required(REQUIRED_MESSAGE)
    .max(name.maxLength.value, name.maxLength.message),
  applyFromDate: date().nullable(),
  applyToDate: date()
    .nullable()
    .when("applyFromDate", ([applyFromDate], schema) => {
      return applyFromDate !== null && applyFromDate
        ? schema.min(applyFromDate, "End date is before Start date")
        : schema;
    }),
});

export type UpdatePriceTableSchemaType = InferType<
  typeof UpdatePriceTableSchema
>;
