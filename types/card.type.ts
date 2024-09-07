import { ResponseAPI } from ".";

export type ListCardResponse = ResponseAPI<CardProps[]>;

export interface CardProps {
  id: string;
  cardNumber: string;
  createdDate: string;
  status: string;
  session: cardSession;
  isInUse: boolean;
}

export interface cardSession {
  sessionId: string;
  gateIn: string;
  plateNumber: string;
  imageInUrl: string;
  imageInBodyUrl: string;
  timeIn: string;
  vehicleType: string;
  customerEmail?: string;
  staffCheckInEmail: string;
}

export type CardKey = keyof CardProps;
