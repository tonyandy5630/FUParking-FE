import { NOT_EMAIL_MESSAGE, REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, object, string } from "yup";
import { getSystemUserRule } from "../rules/user";

const { password } = getSystemUserRule();
const SystemUserSchema = object({
  email: string().email(NOT_EMAIL_MESSAGE).required(REQUIRED_MESSAGE),
  password: string()
    .required(REQUIRED_MESSAGE)
    .min(password.min.value, password.min.message),
  fullName: string().required(REQUIRED_MESSAGE),
  role: string().required(REQUIRED_MESSAGE),
});

export type SystemUserSchemaType = InferType<typeof SystemUserSchema>;
export default SystemUserSchema;
