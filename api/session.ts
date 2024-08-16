import {
  CANCEL_SESSION_API_URL,
  CHECK_OUT_API_URL,
  GET_LIST_SESSION_API_URL,
  GET_SESSION_API_URL,
  PAYMENT_API_URL,
} from "./url/session.url";
import http from "@/utils/http";
import {
  CheckOutResponse,
  ListSessionResponse,
  SessionResponse,
} from "@/types/session.type";

export const listSessionAPI = (
  pageSize: number,
  pageIndex: number,
  startDate: string,
  endDate: string,
  searchInput: string,
  attribute: string
) =>
  http.get<ListSessionResponse>(
    GET_LIST_SESSION_API_URL(
      pageSize,
      pageIndex,
      startDate,
      endDate,
      searchInput,
      attribute
    )
  );

export const getSessionAPI = (sessionId: string) =>
  http.get<SessionResponse>(GET_SESSION_API_URL(sessionId));

export const checkOutAPI = (body: { plateNumber: string; timeOut: string }) =>
  http.post<CheckOutResponse>(CHECK_OUT_API_URL, body);

export const paymentAPI = (cardNumber: string) =>
  http.post(PAYMENT_API_URL(cardNumber));

export const cancelSessionAPI = (sessionId: string) =>
  http.post(CANCEL_SESSION_API_URL(sessionId));
