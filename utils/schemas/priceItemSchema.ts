import {
  MIN_MAX_PRICE_OVERLAP,
  MISSING_PRICE_ITEMS,
  REQUIRED_MESSAGE,
} from "@/constant/message";
import { array, InferType, number, object, string } from "yup";
import getPriceItemRules from "../rules/price-item";

const { from, to, price } = getPriceItemRules();

const PriceItemSchema = object({
  from: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(from.min.value, from.min.message)
    .max(from.max.value, from.max.message)
    .required(REQUIRED_MESSAGE),
  to: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(to.min.value, to.min.message)
    .max(to.max.value, to.max.message)
    .required(REQUIRED_MESSAGE),
  maxPrice: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(price.min.value, price.min.message)
    .required(REQUIRED_MESSAGE),
  minPrice: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(price.min.value, price.min.message)
    .when("maxPrice", ([maxPrice], schema) =>
      maxPrice ? schema.max(maxPrice, MIN_MAX_PRICE_OVERLAP) : schema
    )
    .required(REQUIRED_MESSAGE),
  blockPricing: number()
    .min(price.min.value, price.min.message)
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(REQUIRED_MESSAGE),
});

const CreatePriceItemSchema = object({
  priceTableId: string().required(REQUIRED_MESSAGE),
  priceItems: array().of(PriceItemSchema).min(1).required(MISSING_PRICE_ITEMS),
});

export type CreatePriceItemSchemaType = InferType<typeof CreatePriceItemSchema>;
export default CreatePriceItemSchema;
