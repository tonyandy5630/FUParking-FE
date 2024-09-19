import { boolean, InferType, object, string } from "yup";

export const EditPackageSchema = object({
  packageId: string().required(),
  name: string().required(),
  isActive: boolean().optional(),
});

export type EditPackageSchemaType = InferType<typeof EditPackageSchema>;
