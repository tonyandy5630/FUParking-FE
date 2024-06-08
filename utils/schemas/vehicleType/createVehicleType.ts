import { InferType, object, string } from "yup";

const CreateVehicleTypeSchema = object({
  name: string().trim().required("Vehicle type name is required"),
  description: string().trim(),
});

export type CreateVehicleTypeSchemaType = InferType<
  typeof CreateVehicleTypeSchema
>;
export default CreateVehicleTypeSchema;
