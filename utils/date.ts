import { DATE_FILTER } from "@/constant/date-filter";
import { DateFilterType } from "@/types/filter.type";
import moment, { Moment } from "moment-timezone";

const options: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export function getLocalISOString(date?: Date | null): string {
  if (!date || date === null) {
    return "";
  }
  // Create a formatter for the specified time zone
  if (!Date.parse(date.toString())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: moment.tz.guess(),
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  // Get the date parts in the specified time zone
  const parts = formatter.formatToParts(date);
  const dateParts: { [key: string]: string } = {};
  parts.forEach((part) => {
    if (part.type !== "literal") {
      dateParts[part.type] = part.value;
    }
  });

  // Format the ISO string manually
  const isoString = `${dateParts.year}-${dateParts.month}-${dateParts.day}T${
    dateParts.hour
  }:${dateParts.minute}:${dateParts.second}.${
    dateParts.fractionalSecond || "000"
  }Z`;

  return isoString;
}

export function toVNDateString(date: string) {
  if (!Date.parse(date) && !moment(date)) {
    return "NaN";
  }
  return moment(date).format("DD/MM/YYYY");
}

export default function toLocaleDate(date: string): string {
  if (!Date.parse(date)) {
    return "NaN";
  }
  const formatDate = new Date(date);
  const finalDate = formatDate.toLocaleDateString("vi-VN", options);
  return finalDate;
}

export const formatDateTimeUS = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const MomentToDateJS = (toConvert?: Moment | null) => {
  if (!toConvert || toConvert === null) return null;
  return new Date(toConvert.toString());
};

export const getStartEndDateOfTime = (timeLength: DateFilterType) => {
  switch (timeLength) {
    case DATE_FILTER.today:
      const todayISOString = MomentToDateJS(moment());
      return { startDate: todayISOString, endDate: todayISOString };
    case DATE_FILTER.week: {
      const startWeekMoment = moment().startOf("isoWeek");
      const endWeekMoment = moment().endOf("isoWeek");
      const startDate = MomentToDateJS(startWeekMoment);
      const endDate = MomentToDateJS(endWeekMoment);
      return { startDate, endDate };
    }
    case DATE_FILTER.month: {
      const startMonthMoment = moment().startOf("M");
      const endMonthMoment = moment().endOf("M");
      const startDate = MomentToDateJS(startMonthMoment);
      const endDate = MomentToDateJS(endMonthMoment);
      return {
        startDate,
        endDate,
      };
    }
    case DATE_FILTER.year: {
      const startYearMoment = moment().startOf("year");
      const endYearMoment = moment().endOf("year");
      const startDate = MomentToDateJS(startYearMoment);
      const endDate = MomentToDateJS(endYearMoment);
      return {
        startDate,
        endDate,
      };
    }
    default:
      return {
        startDate: null,
        endDate: null,
      };
  }
};

export const utcTransform = (_: unknown, value: unknown) => {
  if (typeof value === "string" || typeof value === "object") {
    console.log(moment.utc(value as Date).toDate());
    return moment.utc(value as Date).toDate();
  }
  return value;
};
