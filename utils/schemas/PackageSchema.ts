import { boolean, InferType, number, object, string } from "yup";
import { getPackageRules } from "../rules/package";
import { REQUIRED_MESSAGE } from "@/constant/message";

const { coinAmount, expPackage, extraCoin, price } = getPackageRules();

const PackageSchema = object({
  coinAmount: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(coinAmount.min.value, coinAmount.min.message)
    .required(REQUIRED_MESSAGE),
  name: string().required(REQUIRED_MESSAGE),
  extraCoin: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .min(extraCoin.min.value, extraCoin.min.message),
  expPackage: number()
    .transform((value) => (Number.isNaN(value) ? 0 : value))
    .min(expPackage.min.value, expPackage.min.message),
  price: number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .min(price.min.value, price.min.message)
    .required(REQUIRED_MESSAGE),
});

export const UpdatePackageSchema = object({
  packageId: string().required(REQUIRED_MESSAGE),
  name: string().required(REQUIRED_MESSAGE),
  isActive: boolean().required(REQUIRED_MESSAGE),
});

export type PackageSchemaType = InferType<typeof PackageSchema>;
export type UpdatePackageSchemaType = InferType<typeof UpdatePackageSchema>;
export default PackageSchema;
