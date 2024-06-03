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

export const ADD_CUSTOMER_API_URL = `${baseURL}/customers/free`;
