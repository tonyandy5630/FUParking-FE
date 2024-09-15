import getRules from "@/utils/rules/auth";
import { array, InferType, object, string } from "yup";

const rules = getRules();

const GateSchema = object({
  description: string().optional(),
  name: string().required(),
});

const AddGateSchema = object({
  gates: array().of(GateSchema).required(),
});

export type AddGateSchemaType = InferType<typeof AddGateSchema>;

export default AddGateSchema;
