import baseURL from ".";

export const GET_LIST_CARD_API_URL = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string
) =>
  `${baseURL}/cards?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}`;

export const EDIT_CARD_API_URL = (id: string) => `${baseURL}/cards/${id}`;

export const DELETE_CARD_API_URL = (id: string) => `${baseURL}/cards/${id}`;

export const ADD_CUSTOMER_API_URL = `${baseURL}/cards`;
