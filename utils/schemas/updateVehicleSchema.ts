import { REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, object, string } from "yup";

const UpdateVehicleSchema = object({
  vehicleId: string().required(REQUIRED_MESSAGE),
  vehicleTypeId: string().required(REQUIRED_MESSAGE),
});

export type UpdateVehicleSchemaType = InferType<typeof UpdateVehicleSchema>;
export default UpdateVehicleSchema;
