import baseURL from ".";

export const GET_LIST_TRANSACTION_API_URL = (
  pageSize: number,
  pageIndex: number,
  SearchInput: string,
  Attribute: string,
  startDate: string,
  endDate: string
) =>
  `${baseURL}/transaction?PageSize=${pageSize}&PageIndex=${pageIndex}${
    SearchInput ? `&SearchInput=${SearchInput}` : ""
  }&Attribute=${Attribute}${startDate ? `&StartDate=${startDate}` : ""} ${
    endDate ? `&EndDate=${endDate}` : ""
  }`;

export const TOP_UP_CUSTOMER_API_URL = `${baseURL}/transaction/topup`;
