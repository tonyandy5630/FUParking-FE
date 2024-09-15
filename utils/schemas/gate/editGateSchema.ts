import { InferType, object, string } from "yup";
import getRules from "@/utils/rules/auth";

const rules = getRules();

const EditGateSchema = object({
  description: string().optional(),
  name: string().optional(),
  parkingAreaId: string().optional(),
});

export type EditGateSchemaType = InferType<typeof EditGateSchema>;
export default EditGateSchema;
