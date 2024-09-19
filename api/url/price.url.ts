import baseURL from ".";

export const GET_TABLE_PRICE_API_URL = `${baseURL}/prices`;

export const UPDATE_TABLE_STATUS_API_URL = `${baseURL}/price/status`;

export const CREATE_TABLE_API_URL = `${baseURL}/price`;

export const DELETE_TABLE_PRICE_API_URL = (tableId: string) =>
  `${baseURL}/price/${tableId}`;

export const UPDATE_PRICE_TABLE_API_URL = `${baseURL}/price`;

export const GET_PRICE_TABLE_BY_VEHICLE_TYPE_API_URL = ({
  vehicleTypeId,
}: {
  vehicleTypeId: string;
}) => `${baseURL}/price/vehicle-type/${vehicleTypeId}`;
