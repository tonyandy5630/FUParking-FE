import { ResponseAPI } from ".";

export type ListCardResponse = ResponseAPI<CardProps[]>;

export interface CardProps {
  id: string;
  cardNumber: string;
  plateNumber: string;
  createdDate: string;
}

export type CardKey = keyof CardProps;
