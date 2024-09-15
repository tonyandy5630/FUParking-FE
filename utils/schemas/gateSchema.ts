import { REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, object, string } from "yup";

const GateSchema = object({
  description: string(),
  name: string().required(REQUIRED_MESSAGE),
  parkingAreaId: string().required(REQUIRED_MESSAGE),
});

const EditGateSchema = object({
  description: string().optional(),
  name: string().optional(),
  parkingAreaId: string().optional(),
});

export type GateSchemaType = InferType<typeof GateSchema>;
export default GateSchema;
