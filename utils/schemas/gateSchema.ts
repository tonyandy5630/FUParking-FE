import { REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, object, string } from "yup";

const GateSchema = object({
  gateTypeId: string().required(REQUIRED_MESSAGE),
  description: string(),
  name: string().required(REQUIRED_MESSAGE),
  parkingAreaId: string().required(REQUIRED_MESSAGE),
});

export type GateSchemaType = InferType<typeof GateSchema>;
export default GateSchema;
