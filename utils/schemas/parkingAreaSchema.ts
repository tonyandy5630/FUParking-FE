import { REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, number, object, string } from "yup";
import { getParkingAreaRules } from "../rules/parkingArea";

const { block, mode, maxCapacity } = getParkingAreaRules();

const ParkingAreaSchema = object({
  parkingAreaId: string().required(REQUIRED_MESSAGE),
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
});

export type ParkingAreaSchemaType = InferType<typeof ParkingAreaSchema>;
export default ParkingAreaSchema;
