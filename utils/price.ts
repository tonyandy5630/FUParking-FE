//format price to Vietnamese currency format
export const formatPrice = (price?: number, isCurrency?: boolean): string => {
  if (!price) price = 0;
  let currency: Intl.NumberFormatOptions | undefined = undefined;
  if (isCurrency)
    currency = {
      style: "currency",
      currency: "VND",
    };
  return new Intl.NumberFormat("vi-VN", currency).format(price);
};
