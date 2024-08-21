import baseURL from ".";

export const GET_LIST_STATISTIC1_API_URL = () => `${baseURL}/statistic/session`;

export const GET_LIST_STATISTIC2_API_URL = () =>
  `${baseURL}/statistic/payment/method`;

export const GET_TOTAL_REVENUE_API_URL = () =>
  `${baseURL}/statistic/revenue/today`;

export const GET_TOTAL_VEHICLE_PARKED_TODAY_API_URL = () =>
  `${baseURL}/statistic/session/today`;

export const GET_AVERAGE_SESSION_DURATION_PER_DAY_API_URL = () =>
  `${baseURL}/statistic/session/average`;

export const GET_TOTAL_CUSTOMERS_API_URL = () =>
  `${baseURL}/statistic/customer`;

export const GET_TOTAL_VEHICLES_API_URL = () => `${baseURL}/statistic/vehicle`;

export const GET_NUMBER_CHECK_IN_CHECK_OUT_API_URL = () =>
  `${baseURL}/statistic/session/checkin-checkout`;

export const GET_CARD_STATISTIC_API_URL = () => `${baseURL}/statistic/card`;

export const GET_REVENUE_EACH_PARKING_AREA_API_URL = () =>
  `${baseURL}/statistic/parkingarea/renvenue`;
