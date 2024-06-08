import { InferType, object, string } from "yup";

const EditVehicleTypeSchema = object({
  name: string().trim(),
  description: string().trim(),
});

export type EditVehicleTypeSchemaType = InferType<typeof EditVehicleTypeSchema>;
export default EditVehicleTypeSchema;
