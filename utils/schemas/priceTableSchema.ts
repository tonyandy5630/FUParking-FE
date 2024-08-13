import { object, string, InferType, number, date } from "yup";
import getRules from "../rules/price-table";

const { name } = getRules();
const PriceTableTableSchema = object({
  vehicleTypeId: string().required(),
  priority: number().required(),
  name: string().required().max(name.maxLength.value, name.maxLength.message),
  applyFromDate: date(),
  applyToDate: date(),
  pricePerBlock: number().required(),
  maxPrice: number().required(),
  minPrice: number().required(),
});

export type PriceTableTableSchemaType = InferType<typeof PriceTableTableSchema>;
export default PriceTableTableSchema;
