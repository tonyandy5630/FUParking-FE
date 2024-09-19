import { InferType, object, string } from "yup";

const EditUserSchema = object({
  id: string()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    )
    .required(),
  fullName: string().optional(),
  email: string().email().optional().trim(),
  password: string().trim().optional(),
  roleId: string()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    )
    .optional(),
});

export type EditUserSchemaType = InferType<typeof EditUserSchema>;
export default EditUserSchema;
