import http from "@/utils/http";
import {
  GET_AVERAGE_SESSION_DURATION_PER_DAY_API_URL,
  GET_CARD_STATISTIC_API_URL,
  GET_LIST_STATISTIC1_API_URL,
  GET_NUMBER_CHECK_IN_CHECK_OUT_API_URL,
  GET_REVENUE_EACH_PARKING_AREA_API_URL,
  GET_TOTAL_CUSTOMERS_API_URL,
  GET_TOTAL_REVENUE_API_URL,
  GET_TOTAL_VEHICLE_PARKED_TODAY_API_URL,
  GET_TOTAL_VEHICLES_API_URL,
} from "./url/statistic.url";
import { Statistics1 } from "@/types/statistic.type";

export const getStatistic1 = () =>
  http.get<Statistics1>(GET_LIST_STATISTIC1_API_URL());

import { GET_LIST_STATISTIC2_API_URL } from "./url/statistic.url";

export const getStatistic2 = () =>
  http.get<Statistics1>(GET_LIST_STATISTIC2_API_URL());

export const getTotalRevenue = () => http.get(GET_TOTAL_REVENUE_API_URL());

export const getTotalVehicleParkedToday = () =>
  http.get(GET_TOTAL_VEHICLE_PARKED_TODAY_API_URL());

export const getAverageSessionDurationPerDay = () =>
  http.get(GET_AVERAGE_SESSION_DURATION_PER_DAY_API_URL());

export const getTotalCustomers = () => http.get(GET_TOTAL_CUSTOMERS_API_URL());

export const getTotalVehicles = () => http.get(GET_TOTAL_VEHICLES_API_URL());

export const getNumberCheckInCheckOut = () =>
  http.get(GET_NUMBER_CHECK_IN_CHECK_OUT_API_URL());

export const getCardStatistic = () => http.get(GET_CARD_STATISTIC_API_URL());

export const getRevenueEachParkingArea = () =>
  http.get(GET_REVENUE_EACH_PARKING_AREA_API_URL());
