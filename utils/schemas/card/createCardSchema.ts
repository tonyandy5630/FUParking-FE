import { InferType, object, string } from "yup";

const AddCardSchema = object({
  plateNumber: string().trim(),
  cardNumber: string().trim().required("Card number is required"),
});

export type AddCardSchemaType = InferType<typeof AddCardSchema>;
export default AddCardSchema;
