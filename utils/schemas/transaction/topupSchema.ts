import { InferType, number, object, string } from "yup";

const TopUpSchema = object({
  customerId: string()
    .required("Customer ID is required")
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    ),
  amount: number()
    .required("Amount is required")
    .min(1000, "Amount must be greater than 1000"),
});

export type TopUpSchemaType = InferType<typeof TopUpSchema>;
export default TopUpSchema;
