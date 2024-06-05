import { object, string, InferType } from "yup";

const EditCardSchema = object({
  plateNumber: string().trim().required("Plate number is required"),
});

export type EditCardSchemaType = InferType<typeof EditCardSchema>;
export default EditCardSchema;
