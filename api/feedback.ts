import { ErrorResponse } from "@/types";
import { Feedback } from "@/types/feedback.type";
import { PaginationType } from "@/types/pagination.type";
import http from "@/utils/http";
import { GET_ALL_FEEDBACKS_API_URL } from "./url/feedback.url";

export const getAllFeedbacksAPI = (
  pagination: PaginationType,
  {
    cusName,
    parkName,
  }: {
    cusName: string;
    parkName: string;
  }
) =>
  http.get<ErrorResponse<Feedback[]>>(
    GET_ALL_FEEDBACKS_API_URL(pagination, cusName, parkName)
  );
