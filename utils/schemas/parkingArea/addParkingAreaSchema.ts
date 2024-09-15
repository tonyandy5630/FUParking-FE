import { REQUIRED_MESSAGE } from "@/constant/message";
import { getParkingAreaRules } from "@/utils/rules/parkingArea";
import { array, InferType, number, object, string } from "yup";

const { block, mode, maxCapacity } = getParkingAreaRules();
const GateSchema = object({
  name: string().required(REQUIRED_MESSAGE),
  description: string().optional(),
});

const AddParkingAreaSchema = object({
  name: string().required(REQUIRED_MESSAGE),
  description: string(),
  mode: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(mode.min.value, mode.min.message)
    .max(mode.max.value, mode.max.message)
    .required(REQUIRED_MESSAGE),
  block: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(block.min.value, block.min.message)
    .max(block.max.value, block.max.message)
    .required(REQUIRED_MESSAGE),
  maxCapacity: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(maxCapacity.min.value, maxCapacity.min.message)
    .required(REQUIRED_MESSAGE),
  gates: array().of(GateSchema).optional(),
});

export type AddParkingAreaSchemaType = InferType<typeof AddParkingAreaSchema>;
export default AddParkingAreaSchema;
