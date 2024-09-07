import { InferType, object, string } from "yup";

const UpdateVehicleSchema = object({
  vehicleId: string()
    .required("Vehicle type ID is required")
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    ),
  vehicleTypeId: string()
    .optional()
    .matches(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
      "Invalid GUID format"
    ),
  plateNumber: string().optional(),
}).test(
  "at-least-one",
  "At least one of vehicleTypeId or plateNumber is required",
  (value) => {
    return !!(value.vehicleTypeId || value.plateNumber);
  }
);

export type UpdateVehicleSchemaType = InferType<typeof UpdateVehicleSchema>;
export default UpdateVehicleSchema;
