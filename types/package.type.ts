import { ResponseAPI } from ".";

export type ListPackage = ResponseAPI<
  Packages[]
>;

export interface Packages {
  id: string;
  name: string;
  coinAmount: string;
  extraCoin: string;
  expPackage: string;
  price: string;
  packageStatus: string;
  createDate: string;
}
