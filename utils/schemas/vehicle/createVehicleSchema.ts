import getRules from "@/utils/rules/auth";
import { array, object, string } from "yup";

const rules = getRules();

const VehicleSchema = object({
  plateNumber: string()
    .trim()
    .transform((value) => value.replace(/[-.\s]/g, ""))
    .required("Plate number is required")
    .matches(/^[0-9]{2}[A-ZĐ]{1,2}[0-9]{4,6}$/, "Invalid plate number format"),
  vehicleTypeId: string()
    .required("Vehicle type ID is required")
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    ),
});

const NewVehicleSchema = object({
  vehicles: array()
    .of(VehicleSchema)
    .required("Must have at least one vehicle"),
});

export type NewVehicleSchemaType = typeof NewVehicleSchema;
export default NewVehicleSchema;
