import { REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, object, string } from "yup";

const EditVehicleTypeSchema = object({
  id: string().trim().required(REQUIRED_MESSAGE),
  name: string().trim().required(REQUIRED_MESSAGE),
  description: string().trim(),
});

export type EditVehicleTypeSchemaType = InferType<typeof EditVehicleTypeSchema>;
export default EditVehicleTypeSchema;
