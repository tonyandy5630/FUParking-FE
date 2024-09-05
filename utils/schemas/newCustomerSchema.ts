import { InferType, object, string, array } from "yup";
import getRules from "../rules/auth";

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

const NewCustomerSchema = object({
  name: string()
    .trim()
    .min(rules.name.minLength.value, rules.name.minLength.message)
    .max(rules.name.maxLength.value, rules.name.maxLength.message)
    .required("Name is required"),
  email: string()
    .trim()
    .min(rules.email.minLength.value, rules.email.minLength.message)
    .max(rules.email.maxLength.value, rules.email.maxLength.message)
    .email("Not an email")
    .required("Email is required"),
  vehicles: array().of(VehicleSchema).optional(),
});

export type NewCustomerSchemaType = InferType<typeof NewCustomerSchema>;
export default NewCustomerSchema;
