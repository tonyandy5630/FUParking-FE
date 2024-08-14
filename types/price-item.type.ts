export type PriceItem = {
  id: string;
  priceTable: string;
  applyFromHour?: string;
  applyToHour?: string;
  maxPrice: number;
  blockPricing: number;
  minPrice: number;
  status: string;
};
