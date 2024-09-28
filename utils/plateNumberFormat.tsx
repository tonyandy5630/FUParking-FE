export const formatPlateNumber = (plateNumber: string) => {
  switch (plateNumber.length) {
    case 8:
      return `${plateNumber.substring(0, 4)}-${plateNumber.substring(4)}`;
    case 9:
      return `${plateNumber.substring(0, 4)}-${plateNumber.substring(
        4,
        7
      )}.${plateNumber.substring(7)}`;
    case 10:
      return `${plateNumber.substring(0, 5)}-${plateNumber.substring(
        5,
        8
      )}.${plateNumber.substring(8)}`;
    default:
      return plateNumber;
  }
};
