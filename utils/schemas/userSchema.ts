import { NOT_EMAIL_MESSAGE, REQUIRED_MESSAGE } from "@/constant/message";
import { InferType, object, string } from "yup";

const SystemUserSchema = object({
  email: string().email(NOT_EMAIL_MESSAGE).required(REQUIRED_MESSAGE),
  password: string().required(REQUIRED_MESSAGE),
  fullName: string().required(REQUIRED_MESSAGE),
  role: string().required(REQUIRED_MESSAGE),
});

export type SystemUserSchemaType = InferType<typeof SystemUserSchema>;
export default SystemUserSchema;
