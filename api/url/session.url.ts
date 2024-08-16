import baseURL from ".";

export const GET_LIST_SESSION_API_URL = (
  pageSize: number,
  pageIndex: number,
  startDate: string,
  endDate: string,
  searchInput: string,
  attribute: string
) =>
  `${baseURL}/session/user/history?PageSize=${pageSize}&PageIndex=${pageIndex}${
    searchInput ? `&SearchInput=${searchInput}` : ""
  }&Attribute=${attribute}${startDate ? `&StartDate=${startDate}` : ""} ${
    endDate ? `&EndDate=${endDate}` : ""
  }`;

export const GET_SESSION_API_URL = (sessionId: string) =>
  `${baseURL}/session/user/history/${sessionId}`;

export const CHECK_OUT_API_URL = `${baseURL}/session/user/checkout`;

export const PAYMENT_API_URL = (cardNumber: string) =>
  `${baseURL}/session/payment?cardNumber=${cardNumber}`;

export const CANCEL_SESSION_API_URL = (sessionId: string) =>
  `${baseURL}/session/${sessionId}/cancel`;
