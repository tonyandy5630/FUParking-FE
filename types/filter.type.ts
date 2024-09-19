import { DATE_FILTER } from "@/constant/date-filter";

const { month, today, week, year } = DATE_FILTER;
export type DateFilterType =
  | typeof today
  | typeof week
  | typeof year
  | typeof month;
