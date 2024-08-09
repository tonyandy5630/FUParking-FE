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
}

export type CustomerWithFillerKey = keyof CustomerWithFillerProps;
