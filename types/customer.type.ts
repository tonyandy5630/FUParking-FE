import { ResponseAPI } from ".";

export type ListCustomerWithFillerReponse = ResponseAPI<
  CustomerWithFillerProps[]
>;

export interface CustomerWithFillerProps {
  customerId: string;
  fullName: string;
  email: string;
  statusCustomer: string;
  customerType: string;
  createdDate: string;
  customerTypeId: string;
}

export type CustomerTypeResponse = ResponseAPI<CustomerTypeProps[]>;

export interface CustomerTypeProps {
  id: string;
  name: string;
  description: string;
}

export type CustomerBalance = {
  balanceMain: number;
  balanceExtra: number;
  expDate: string | null;
};

export type CustomerWithFillerKey = keyof CustomerWithFillerProps;

export type CustomerTypeKey = keyof CustomerTypeProps;
