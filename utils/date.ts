const options: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "numeric",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

export function getLocalISOString(date: Date): string {
  var tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  var localISOTime = new Date(Date.now() - tzoffset).toISOString();

  return localISOTime;
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
