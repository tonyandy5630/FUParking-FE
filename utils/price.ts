//format price to Vietnamese currency format
export const formatPrice = (price?: number): string => {
  if (!price) return "0";
  return new Intl.NumberFormat("vi-VN").format(price);
};
