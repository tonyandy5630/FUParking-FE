export type ResponseAPI<Data> = {
  message?: string;
  data?: Data;
  isSuccess: boolean;
};

export type SuccessResponse<Data> = {
  message?: string;
  data: Data;
  isSuccess: boolean;
};

export type LoginResponse<Data> = {
  message?: string;
  data: Data;
  isSuccess: boolean;
};

export type ErrorResponse<Data> = {
  message?: string;
  data?: Data;
  isSuccess: boolean;
};
