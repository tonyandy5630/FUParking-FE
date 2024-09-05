import { SearchAttribute } from "@/types/vehicle.type";
import baseURL from ".";

export const GET_LIST_VEHICLE_API_URL = ({
  pageSize,
  pageIndex,
  SearchInput,
  Attribute,
  StartDate,
  EndDate,
}: {
  pageSize: number;
  pageIndex: number;
  SearchInput: string;
  Attribute: SearchAttribute;
  StartDate?: string;
  EndDate?: string;
}) =>
  `${baseURL}/vehicles?PageSize=${pageSize}&pageIndex=${
    pageIndex + 1
  }&SearchInput=${SearchInput}&Attribute=${Attribute}`;

export const CHANGE_VEHICLE_STATUS_API_URL = `${baseURL}/vehicles/user/vehicle/status`;

export const UPDATE_VEHICLE_API_URL = `${baseURL}/vehicles/user/update`;

export const GET_LIST_VEHICLE_BY_CUSTOMER_API_URL = ({
  customerId,
}: {
  customerId: string;
}) => `${baseURL}/vehicles/customers/${customerId}`;

export const CREATE_VEHICLE_FOR_CUSTOMER_BY_USER_API_URL = `${baseURL}/vehicles`;
