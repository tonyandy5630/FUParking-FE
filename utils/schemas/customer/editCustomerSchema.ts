import { InferType, object, string } from "yup";

const EditCustomerSchema = object({
  customerId: string()
    .required("Customer ID is required")
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    ),
  customerTypeId: string()
    .optional()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    ),
  fullName: string().trim().optional(),
  email: string().trim().email("Not an email").optional(),
});

export type EditCustomerSchemaType = InferType<typeof EditCustomerSchema>;
export default EditCustomerSchema;
