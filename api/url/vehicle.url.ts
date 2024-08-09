import baseURL from ".";

export const GET_LIST_VEHICLE_API_URL = (
    pageSize: number,
    pageIndex: number,
    SearchInput: string,
    Attribute: string,
    StartDate: string,
    EndDate: string
) => `${baseURL}/vehicle`;
