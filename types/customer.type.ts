import { ResponseAPI } from ".";

export type ListCustomerWithFillerReponse = ResponseAPI<
  CustomerWithFillerProps[]
>;

export interface CustomerWithFillerProps {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  statusCustomer: string;
  customerType: string;
  createdDate: string;
}

export type CustomerWithFillerKey = keyof CustomerWithFillerProps;
