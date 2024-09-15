import baseURL from ".";

export const GET_LIST_CUSTOMER_WITH_FILLER_API_URL = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  `${baseURL}/customers?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;

export const CHANGE_STATUS_CUSTOMER_API_URL = `${baseURL}/customers/status`;

export const CREATE_CUSTOMER_NON_PAID_API_URL = `${baseURL}/customers/nonpaid`;

export const DELETE_CUSTOMER_API_URL = ({
  customerId,
}: {
  customerId: string;
}) => `${baseURL}/customers/${customerId}`;

export const GET_LIST_CUSTOMER_TYPE_API_URL = `${baseURL}/customers/type`;

export const EDIT_CUSTOMER_API_URL = `${baseURL}/customers/info`;

export const VIEW_CUSTOMER_BALANCE_API_URL = (customerId: string) =>
  `${baseURL}/wallet/balance/${customerId}`;
