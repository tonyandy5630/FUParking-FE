export type ResponseAPI<Data> = {
  message?: string;
  data?: Data;
  totalRecord?: number;
};

export type SuccessResponse<Data> = {
  message?: string;
  data: Data;
};

export type LoginResponse<Data> = {
  message?: string;
  data: Data;
};

export type ErrorResponse<Data> = {
  message?: string;
  data?: Data;
};
