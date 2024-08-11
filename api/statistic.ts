import http from "@/utils/http";
import {
  GET_LIST_STATISTIC1_API_URL,
} from "./url/statistic.url";
import { Statistics1 } from "@/types/statistic.type";

export const getStatistic1 = () => http.get<Statistics1>(
    GET_LIST_STATISTIC1_API_URL()
);

import {
  GET_LIST_STATISTIC2_API_URL,
} from "./url/statistic.url";

export const getStatistic2 = () => http.get<Statistics1>(
    GET_LIST_STATISTIC2_API_URL()
);