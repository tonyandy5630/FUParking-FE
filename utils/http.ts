import { ResponseAPI, SuccessResponse } from "@/types";
import { AuthResponse } from "@/types/auth.type";
import axios, { AxiosError, HttpStatusCode, type AxiosInstance } from "axios";
import { toast } from "react-toastify";
import {
  clearLS,
  getAccessTokenFromLS,
  setAccessTokenToLS,
} from "./localStorage";
class Http {
  instance: AxiosInstance;
  private accessToken: string;
  constructor() {
    this.accessToken = getAccessTokenFromLS();
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_AZURE_API,
      timeout: 10000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken !== "" && config.headers) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
          return config;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        this.accessToken = (response.data as AuthResponse).data.bearerToken;
        setAccessTokenToLS(this.accessToken);
        if (url === "/logout") {
          clearLS();
        }
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data;
          const message = data.message || error.message;
          toast.error(message);
        }
        return Promise.reject(error);
      }
    );
  }
}

const http = new Http().instance;
export default http;
