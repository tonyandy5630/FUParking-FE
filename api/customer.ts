import http from "@/utils/http";
import {
  ADD_CUSTOMER_API_URL,
  CHANGE_STATUS_CUSTOMER_API_URL,
  GET_LIST_CUSTOMER_WITH_FILLER_API_URL,
} from "./url/customer.url";
import { ListCustomerWithFillerReponse } from "@/types/customer.type";
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

export const addCustomerAPI = (body: {
  name: string;
  email: string;
  phone?: string;
}) => http.post<AuthResponse>(ADD_CUSTOMER_API_URL, body);
