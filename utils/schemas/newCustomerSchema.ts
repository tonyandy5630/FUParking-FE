import { InferType, object, string } from "yup";
import getRules from "../rules/auth";

const rules = getRules();

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
  phone: string()
    .trim()
    .test("phone", "Phone is invalid", (phone) => {
      if (phone && phone.length > 0) {
        return string()
          .min(rules.phone.minLength.value, rules.phone.minLength.message)
          .max(rules.phone.maxLength.value, rules.phone.maxLength.message)
          .isValidSync(phone);
      }
      return true;
    }),
});

export type NewCustomerSchemaType = InferType<typeof NewCustomerSchema>;
export default NewCustomerSchema;
