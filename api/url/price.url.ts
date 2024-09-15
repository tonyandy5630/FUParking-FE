import baseURL from ".";

export const GET_TABLE_PRICE_API_URL = `${baseURL}/prices`;

export const UPDATE_TABLE_STATUS_API_URL = `${baseURL}/price/status`;

export const CREATE_TABLE_API_URL = `${baseURL}/price`;

export const DELETE_TABLE_PRICE_API_URL = (tableId: string) =>
  `${baseURL}/price/${tableId}`;
