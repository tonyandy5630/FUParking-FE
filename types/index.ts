export type ResponseAPI<Data> = {
  message?: string;
  data?: Data;
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
