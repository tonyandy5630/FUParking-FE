import http from "@/utils/http";
import {
  CHANGE_STATUS_CUSTOMER_API_URL,
  CREATE_CUSTOMER_NON_PAID_API_URL,
  DELETE_CUSTOMER_API_URL,
  EDIT_CUSTOMER_API_URL,
  GET_LIST_CUSTOMER_TYPE_API_URL,
  GET_LIST_CUSTOMER_WITH_FILLER_API_URL,
} from "./url/customer.url";
import {
  CustomerTypeResponse,
  ListCustomerWithFillerReponse,
} from "@/types/customer.type";
import { AuthResponse } from "@/types/auth.type";

export const getListCustomerWithFillerAPI = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  http.get<ListCustomerWithFillerReponse>(
    GET_LIST_CUSTOMER_WITH_FILLER_API_URL(
      pageSize,
      pageIndex,
      SearchInput,
      Attribute
    )
  );

export const changeStatusCustomerAPI = (body: {
  isActive: boolean;
  customerId: string;
}) => http.put<AuthResponse>(CHANGE_STATUS_CUSTOMER_API_URL, body);

export const createCustomerNonPaidAPI = (body: {
  name: string;
  email: string;
  vehicles?: {
    plateNumber: string;
    vehicleTypeId: string;
  }[];
}) => http.post(CREATE_CUSTOMER_NON_PAID_API_URL, body);

export const deleteCustomerAPI = (customerId: string) =>
  http.delete(DELETE_CUSTOMER_API_URL({ customerId }));

export const getCustomerTypesAPI = http.get<CustomerTypeResponse>(
  GET_LIST_CUSTOMER_TYPE_API_URL
);

export const editCustomerAPI = (body: {
  customerId: string;
  customerTypeId?: string;
  fullName?: string;
  email?: string;
}) => http.put(EDIT_CUSTOMER_API_URL, body);
