import {
  MIN_MAX_PRICE_OVERLAP,
  MISSING_PRICE_ITEMS,
  REQUIRED_MESSAGE,
} from "@/constant/message";
import { array, InferType, number, object, string } from "yup";
import getPriceItemRules from "../rules/price-item";

const { from, to, price } = getPriceItemRules();

const PriceItemSchema = object({
  applyFromHour: number()
    .min(from.min.value, from.min.message)
    .max(from.max.value, from.max.message)
    .required(REQUIRED_MESSAGE),
  applyToHour: number()
    .min(to.min.value, to.min.message)
    .max(to.max.value, to.max.message)
    .when("applyFromHour", ([applyFromHour], schema) => {
      return from
        ? schema.min(applyFromHour + 1, "To Hour must greater than From Hour")
        : schema;
    })
    .required(REQUIRED_MESSAGE),
  maxPrice: number().min(price.min.value, price.min.message),
  minPrice: number()
    .min(price.min.value, price.min.message)
    .when("maxPrice", ([maxPrice], schema) =>
      maxPrice ? schema.max(maxPrice, MIN_MAX_PRICE_OVERLAP) : schema
    )
    .required(REQUIRED_MESSAGE),
  blockPricing: number()
    .min(price.min.value, price.min.message)
    .required(REQUIRED_MESSAGE),
});

const PriceItemRequestSchema = object({
  priceTableId: string().required(REQUIRED_MESSAGE),
  priceItems: array().of(PriceItemSchema).min(1).required(MISSING_PRICE_ITEMS),
});

export type PriceItemRequestSchemaType = InferType<
  typeof PriceItemRequestSchema
>;
export default PriceItemRequestSchema;
