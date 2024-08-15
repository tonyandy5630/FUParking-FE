import baseURL from ".";

export const GET_ALL_PRICE_ITEM_BY_TABLE_API_URL = (id: string) =>
  `${baseURL}/price/${id}/items`;

export const CREATE_PRICE_ITEMS_API_URL = `${baseURL}/price/vehicle/item`;

export const UPDATE_PRICE_ITEMS_API_URL = `${baseURL}/price/vehicle/item`;
