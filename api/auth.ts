import http from "@/utils/http";
import { LOGIN_API_URL, ROLE_API_URL } from "./url/auth.url";
import { AuthResponse } from "@/types/auth.type";

export const loginAPI = (body: { email: string; password: string }) =>
  http.post<AuthResponse>(LOGIN_API_URL, body);

export const roleAPI = (body: {}) => http.get<AuthResponse>(ROLE_API_URL);
