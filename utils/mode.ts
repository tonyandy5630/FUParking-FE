export const MODES = [
  {
    name: "Hourly Entry Rate",
    value: 1,
  },
  {
    name: "Hourly Exit Rate",
    value: 2,
  },
  {
    name: "Highest Rate Pricing",
    value: 3,
  },
  {
    name: "Lowest Rate Pricing",
    value: 4,
  },
];

export default function getModeName(mode: number) {
  return MODES.find((item) => item.value === mode)?.name ?? "NaN";
}
