import dayjs from "dayjs";
import moment from "moment-timezone";

const options: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export function getLocalISOString(date?: Date): string {
  if (!date) {
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
  if (!Date.parse(date) && !dayjs(date)) {
    return "NaN";
  }
  return dayjs(date).format("DD/MM/YYYY");
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
