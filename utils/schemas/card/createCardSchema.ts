import { array, InferType, object, string } from "yup";

const CardSchema = object({
  cardNumber: string().required("Card number is required"),
});

const AddCardSchema = object({
  cardNumbers: array().of(CardSchema).default([]),
});

export type AddCardSchemaType = typeof AddCardSchema;
export default AddCardSchema;
