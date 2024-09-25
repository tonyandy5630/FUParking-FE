import { InferType, number, object, string } from "yup";

const CreateVehicleTypeSchema = object({
  name: string().trim().required("Vehicle type name is required"),
  description: string().trim().optional(),
  blockPricing: number().required("Block pricing is required").positive(),
  maxPrice: number()
    .required("Max price is required")
    .positive()
    .min(100, "Max price must be more than 100"),
  minPrice: number()
    .required("Min price is required")
    .positive()
    .min(100, "Min price must be more than 100"),
});

export type CreateVehicleTypeSchemaType = InferType<
  typeof CreateVehicleTypeSchema
>;
export default CreateVehicleTypeSchema;
